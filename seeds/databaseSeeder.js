import userSeeder from "./userSeeder.js";
import permissionSeeder from "./permissionSeeder.js";

const databaseSeeder = () =>{
    permissionSeeder();
    userSeeder();
   
}
export default databaseSeeder;