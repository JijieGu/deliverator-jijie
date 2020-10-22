const pg = require("pg");


/**
 * merchant 
 * username
 * password
 * first name
 * role 
 * id 
 * 
 *  Consumers 
 * username
 * password
 * first name
 * id 
 */
class DBOperations {
    


    pool =  new pg.Pool({
        database: process.env.DB_DATABASE || "skidmore",
        user: process.env.DB_USER ||"postgres", 
        password: process.env.DB_PASSWORD||"postgres", 
        host: process.env.DB_HOST||"127.0.0.1", 
        port: process.env.DB_PORT||5432
    });

    isAuthenticated(username, password, tableName){

        //var isRealUser = false;
        //console.log(isRealUser, " Authenticated in DB before", username, password, tableName)
       return  this.pool.query(`SELECT * from ${tableName} where username = '${username}' and password = '${password}'`); 
        
    }

    addConsumer(username, password, firstName){
        console.log("Adding Consumer via REgistration");
        return this.pool.query(`INSERT INTO CONSUMERS (username, password, firstname) VALUES ('${username}', '${password}', '${firstName}')`);
    }

    addMerchant(username, password, firstName, store_Name){
        console.log("Adding Merchant via REgistration");
        return this.pool.query(`INSERT INTO MERCHANTS (username, password, firstname, store_name, role) VALUES ('${username}', '${password}', '${firstName}' , '${store_Name}', 'MERCHANT')`);
    }
    addOrder(consumer_id, items, store_name){
        console.log("Adding Order");
        return this.pool.query(`INSERT INTO ORDERS (consumer_id, items, store_name) VALUES (${consumer_id}, '${items}', '${store_name}')`);
    }

    getOrders(){
        console.log("GETTING Order");
        return this.pool.query(`SELECT * FROM ORDERS`);
    }

    getOrdersByStore(store_name){
        console.log("GETTING Order " + store_name);
        return this.pool.query(`SELECT * FROM ORDERS WHERE store_name = '${store_name}'`);
    }
     testTime() {

        this.pool.query("SELECT NOW()", function(err, result, fields){
           // console.log(result)
           for (var i = 0; i < result.rows.length; i++){
               console.log(result.rows[i]); 
           }
            pool.end();
        });
    }   
}
 



module.exports = {
    DBOperations
}