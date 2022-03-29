import { use } from "chai";
import chaiArrays from "chai-arrays";
import chaiAsPromise from "chai-as-promised";
import chaiDateTime from "chai-datetime";
import sinonChai from "sinon-chai";

use(chaiAsPromise);
use(chaiDateTime);
use(sinonChai);
use(chaiArrays);
