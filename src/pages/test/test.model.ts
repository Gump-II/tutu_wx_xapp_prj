
import { AutoWired, Inject,Singleton,Scope, Scoped, Provided, Provider } from "../../lib/ioc/typescript-ioc"
import { Type } from "../../lib/ioc/reflect.decorator"


@AutoWired
class PersonDAO {
    psDao: string = "good";
    sayHello(): void {
        console.log("hello")
    }
}

import { Reflect } from "../../lib/ioc/Reflect"

@AutoWired
@Type(ManDao)
class ManDao {
    name: string = "world"
    @Inject
    @Type(PersonDAO)
    personDAO: PersonDAO;
}
@AutoWired
@Type(PersonService)
class PersonService {
    @Inject
    @Type(ManDao)
    manDao: ManDao;



    say(): void {
        console.log("成功", this.manDao.personDAO.psDao);
    }
    constructor() {

    }
}

class Demo {
    public attr1: string;
}

export { PersonService, Demo }