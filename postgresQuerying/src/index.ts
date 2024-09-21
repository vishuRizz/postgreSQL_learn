import { Client } from "pg";
const client = new Client({
    connectionString: "postgresql://sqlTest_owner:4zp1WZsPKqdi@ep-withered-moon-a5qujc3r.us-east-2.aws.neon.tech/sqlTest?sslmode=require"
})
/// creating a new table in postgressssss
async function connectClient() {
    try {
      await client.connect();
      console.log("Connected to the database.");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }


async function createAdminTable(){
   
  try{
    await client.connect()
    const result = await client.query(`
        CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        `)
    console.log(result)
  } catch(error){
    console.error("errror found ", error)
  } finally {
    await client.end();
  }
}


// inserting data in the existing table
async function insertData(username: string, email: string, password: string){
   try {
    connectClient();
    const result = await client.query(`
        INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
        [username, email, password])

    console.log("User inserted:", result.rows[0]);
   } catch (error){
    console.error("caught error ", error)
   } finally {
    await client.end();
  }  
}

// insertData("aviBaby", "aviBaby@gmail.com", "aviBabyPass")
// async function getUserByEmail(email: string){
//     try{
//        await client.connect()
//        const query = `
//         SELECT * FROM users WHERE email = $1;`
//        const result = await client.query( query,
//     [email])
//     console.log(result.rows)
//     } catch(error){
//         console.error("caught error ", error)
//     } finally {
//         await client.end(); 
//       }
// }


// getUserByEmail("vishu@gmail.com")

// createAdminTable()
async function insertDataToAdmin(username: string, email: string, password: string){
    try{
        await client.connect();
        const query = (`INSERT INTO admins (username, email, password) VALUES ($1, $2, $3)`)
        const result = await client.query(query, [username, email, password])
    } catch(error){
        console.log("error found ", error)
    } finally{
        await client.end();
    }
    }

    // insertDataToAdmin("admin1", "admin1@gmail.com", "admin1Pass")


    // Making relationships by creating the address table for the users

    async function createAddressTable(){
      
        try{
            const query = (`CREATE TABLE IF NOT EXISTS addresses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                street VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                zip_code VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id)
                )`)
                const result = await client.query(query)
                console.log(result)
                } catch(error){
                    console.log("error found ", error)
                    } finally{
                        await client.end();
                        }
                        }
    
//   createAddressTable()
async function insertingAddress(user_id: number, street: string, city: string, state: string, zip_code: string){
    connectClient();
    try{
        const result = await client.query(`
            INSERT INTO addresses (user_id, street, city, state, zip_code) VALUES ($1, $2, $3, $4, $5) RETURNING *
            `,[user_id, street, city, state, zip_code])
            console.log("Address inserted:", result.rows)
    }catch(error){
        console.log("error found ", error)
    }
}

// insertingAddress(2, "street 2", "mirzapur", "UP", "322323")

async function getUserAddress(userId: number){
    try{
        
        const query = (`SELECT u.id, u.username, u.email, a.street, a.city, a.state
            FROM USERS u
            JOIN addresses a ON u.id = a.user_id 
            WHERE u.id = $1 `)
            const result = await client.query(query, [userId])
            console.log("kuch to print hua", result.rows)
    } catch(error){
        console.log("error found ", error)
    } finally{
        await client.end();
    }
}
// getUserAddress(2)

