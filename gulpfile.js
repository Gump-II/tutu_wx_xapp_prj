const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const modify = require('gulp-modify');
const rename = require("gulp-rename");
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const readJson = require('read-package-json');
const clean = require("gulp-clean");
var minimist = require('minimist');

//---------------------------------命令参数配置----------------------
//配置命令参数,比如 --logger false
let knownOptions = {
    string: 'logger',
};
let options = minimist(process.argv.slice(2), knownOptions);

//---------------------------------编译替换配置，一般用于配置wxml文件----------------------
const replaceData = [
    //公司电话
    {
        mark: /<% COM_TEL %>/g,
        value: "02862501972"
    },
    {
        mark: /<% COM_TEL_SHOW %>/g,
        value: "028-6250-1972"
    },
    //form表单类型标签
    {
        mark: /<% FORM_INPUT %>/g,
        value: "input"
    }, {
        mark: /<% FORM_OPTIONS %>/g,
        value: "options"
    }, {
        mark: /<% FORM_OPTIONS_SLECTOR %>/g,
        value: "options_selector"
    }, {
        mark: /<% FORM_TEXTAREA %>/g,
        value: "textarea"
    }, {
        mark: /<% FORM_OPTIONS_DATE %>/g,
        value: "options_date"
    }, {
        mark: /<% FORM_INPUT_BUTTON %>/g,
        value: "form_input_button"
    }, {
        mark: /<% FORM_SPLIT_TEXT %>/g,
        value: "split_text"
    }, {
        mark: /<% FORM_KEY_PREFIX %>/g,
        value: "form_key_prefix"
    }, {
        mark: /<% FORM_IMAGES_UPLOAD %>/g,
        value: "form_images_upload"
    },
    //路径
    {
        mark: /<% PAGE_ASSETS_IMAGE %>/g,
        value: "../../assets/images/"
    }


]


const tsProject = ts.createProject('tsconfig.json');

const paths = {
    scripts: [
        'typings/weapp.d.ts',
        'src/**/*.ts',
    ],
    staticImages: [
        'src/**/*.png',
        'src/**/*.jpg',
        'src/**/*.gif',
    ],
    staticLibs: [
        "src/lib*/**/*.js",
        'src/pages*/**/*.js'
    ],

    staticWxFiles: [
        'src/**/*.json',
        'src/**/*.wxml',
        'src/**/*.wxss',
    ]
};
//需要删除的文件
const delFiles = ["dist/lib/**/src"]
    //node_modules 库文件配置
const packages = {
    'rxjs': {
        notBundle: true
    },
};

// 依赖拷贝js
//依赖的rxjs文件，精简rxJs的体积
const rxJsRequiredFile = "src/rxjs.operator.ts"

//rxJs具体依赖的内容
let rxJsRequiredContents = "";

const copyJs = (file, base, dest) => {
    let fix;
    if (file.indexOf('node_modules') === 0) {
        let packageName = file.substr(13);
        packageName = packageName.substring(0, packageName.indexOf('/'));
        const package = packages[packageName];
        if (package && package.fix && !package.fix.search) {
            fix = package.fix[path.basename(file)];
        }
    }

    gulp.src(file, { base })
        .pipe(gulpif(fix !== undefined, modify({
            fileModifier: (file, contents) => {
                fix.forEach((it) => {
                    contents = contents.replace(it.search, it.replace)
                });
                return contents;
            },
        })))
        .pipe(uglify())
        .pipe(gulp.dest(dest))
        .on('end', () => {
            fs.readFile(file, 'utf8', (err, contents) => {
                if (err) {
                    console.error(err);
                    return;
                }
                const matchs = contents.match(/(require\('.*'\))/g);
                if (!matchs) {
                    return
                }
                matchs.forEach((fileName) => {
                    //精简RxJs 
                    let filePath = fileName.substring(9, fileName.length - 2);
                    if (file.indexOf("Rx") != -1 && rxJsRequiredContents != "" && filePath.indexOf("add")) {
                        if (rxJsRequiredContents.indexOf(filePath) == -1) {
                            return;
                        }
                    }

                    if (!filePath.match(/\.js/g)) {
                        filePath = `${filePath}.js`;
                    }
                    const subfile = path.join(path.dirname(file), filePath);
                    fs.exists(path.join(dest, filePath), (exists) => {
                        if (!exists) {
                            copyJs(subfile, base, dest);
                        }
                    });
                });
            });
        })
        //删除Rx.js，临时解决方案
        //用clean会报错，所以直接清空了该文件
        .pipe(gulpif(file.indexOf("Rx") != -1, modify({
            fileModifier: (file, contents) => {
                contents = "";
                return contents;
            },
        }))).pipe(gulp.dest(dest));
}

//编译ts
gulp.task('compile', () => {
    gulp.src(paths.scripts)
        .pipe(tsProject())
        .js.pipe(modify({
            // 文件修改，替换`require('bluebird')`为`require("../libs/bluebird")`
            fileModifier: (file, contents) => {
                let pathSymbol = "/";
                const matchs = contents.match(/(require\("([^.].*)"\))/g);
                if (!matchs) {
                    return contents;
                }
                let rPath = path.relative(file.path, './src');
                rPath = rPath.substring(0, rPath.length - 2);
                if (rPath.length === 0) {
                    rPath = './';
                }
                matchs.forEach((packageName) => {
                    packageName = packageName.substring(9, packageName.length - 2)
                    const package = packages[packageName];
                    if (package && package.addIndex) {
                        contents = contents.replace(new RegExp(`(require\\("(${packageName})"\\))`, 'g'), 'require("$2/index")');
                    }
                });
                var reg = /[\\\/]/g;
                rPath = rPath.replace(reg, "/");
                return contents.replace(/(require\("([^.].*)"\))/g, `require("${rPath}libs/$2")`);
            },
        })).pipe(replaceMarkFileModifier())
        .pipe(gulp.dest('dist'));
});

//替换站位标签 <% COM_TEL %>之类的
function replaceMarkFileModifier() {
    return modify({
        fileModifier: (file, contents) => {
            // console.log("replace", replaceData);
            replaceData.forEach(data => {
                contents = contents.replace(data.mark, data.value);
            })
            return contents;
        }
    });
}

gulp.task('copyStatic', () => {
    gulp.src(paths.staticImages)
        .pipe(gulp.dest('dist'));
    gulp.src(paths.staticLibs).pipe(gulp.dest("dist"));
    gulp.src(paths.staticWxFiles).pipe(replaceMarkFileModifier()).pipe(gulp.dest("dist"));
});

// 复制package.json中的依赖库到dist/libs
gulp.task('copyLibs', () => {
    fs.readFile(rxJsRequiredFile, 'utf8', (err, contents) => {
        const matchs = contents.match(/import '.*';/g);
        if (!matchs) {
            return;
        }
        matchs.forEach((filename) => {
            let filePath = "./" + filename.substring(13, filename.length - 2);
            rxJsRequiredContents += filePath + "\n";
        })
    })



    readJson('package.json', (err, { dependencies }) => {
        Object.keys(dependencies).forEach((name) => {
            const package = packages[name];
            if (!package) {
                readJson(path.join('node_modules', name, 'package.json'), (err, data) => {
                    const file = path.join('node_modules', name, data.browser || data.main);
                    gulp.src(file, { base: path.dirname(file) })

                    .pipe(gulp.dest('dist/libs'));
                });
            } else {
                if (!package.notBundle) {
                    const file = path.join('node_modules', name, package.main);
                    gulp.src(file, { base: path.dirname(file) })
                        .pipe(gulpif(package.fix, modify({
                            fileModifier: (file, contents) => {
                                return contents.replace(package.fix.search, package.fix.replace);
                            },
                        })))
                        .pipe(rename(`${name}.js`))
                        .pipe(uglify())
                        .pipe(gulp.dest('dist/libs'));
                } else {
                    // 拷贝所有js文件，主要是为了redux-observable需要rxjs
                    readJson(path.join('node_modules', name, 'package.json'), (err, data) => {
                        const file = path.join('node_modules', name, data.main);

                        copyJs(file, path.dirname(file), path.join('dist', 'libs', name));
                    });
                }
            }
        });
        // TODO 删除不存在的库
    });
});

//清空生成文件夹
gulp.task("clean", () => {
    gulp.src("dist").pipe(clean())
})

//修改环境变量
let envOptionsFileModifier = (file, contents) => {
    let newContens = contents.replace(/debug: true,/g, "debug: " + options.debug + ",").replace(/logger: true/g, "logger: " + options.logger);
    return newContens;
}

//更新环境变量
function updateEnv() {
    gulp.src(envFilePath).pipe(modify({
        fileModifier: envOptionsFileModifier
    })).pipe(gulp.dest("dist"));
}



//修改工程的环境变量
var envFilePath = "src/shared*/config*/env.config.js"
gulp.task("debugEnv", ["delFiles"], () => {
    options.debug = true;
    options.logger = true;
    updateEnv();
})

gulp.task("prodEnv", ["delFiles"], () => {
    options.debug = false;
    options.logger = true;
    updateEnv();
})


gulp.task("buildEnv", ["delFiles"], () => {
    options.debug = false;
    //默认关闭日志
    if (options.logger == undefined) {
        options.logger = false;
    } else {
        options.logger = true;
    }

    updateEnv();
})

gulp.task("delFiles", () => {
    delFiles.forEach((file) => {
        gulp.src(file).pipe(clean());
    })
})

//调试本地
gulp.task("debug", ['copyLibs', 'copyStatic', 'compile', 'debugEnv'], () => {
    gulp.watch('package.json', ['copyLibs']);
    gulp.watch(paths.staticImages, ['copyStatic']);
    gulp.watch(paths.staticWxFiles, ['copyStatic'])
    gulp.watch(paths.staticLibs, ['copyStatic']);
    gulp.watch(paths.scripts, ['compile']);
})

//调试线上
gulp.task("prod", ['copyLibs', 'copyStatic', 'compile', 'prodEnv'], () => {
    gulp.watch('package.json', ['copyLibs']);
    gulp.watch(paths.staticImages, ['copyStatic']);
    gulp.watch(paths.staticWxFiles, ['copyStatic'])
    gulp.watch(paths.staticLibs, ['copyStatic']);
    gulp.watch(paths.scripts, ['compile']);
})

//发布状态用
gulp.task("build", ['copyLibs', 'copyStatic', 'compile', 'buildEnv'], () => {})