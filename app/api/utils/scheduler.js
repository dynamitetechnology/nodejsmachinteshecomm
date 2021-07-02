const cron = require('node-cron');
const pgPool = require('../../../config/db').pgPool;
const sendEmail = require('./email').sendEmail;

module.exports = {
    stockNotification: () => {
        cron.schedule('0 */1 * * *', () => {
            pgPool.query(`SELECT product_name, product_price FROM products WHERE stock = 0`, async (err, obj) => {
                let recordset = await obj.rows;
                if (recordset.length > 0) {
                    let emailTemplate = `<h5>The below products are out of stock:</h5><ul>`;
                    for (let product of recordset) {
                        emailTemplate += `<li>Name: ${product.product_name} | Price: ${product.product_price}</li>`
                    }
                    emailTemplate += `</ul>`

                    sendEmail('test@thelastyogi.com', 'surajvishwakarma@gmail.com', 'Product out of stock!', emailTemplate)
                }
            })
        });

    }
}