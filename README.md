POST - http://localhost:3010/api/auth/register
    {
        "name": "test01",
        "email": "test01@gmail.com",
        "password": "123456"
    }

POST - http://localhost:3010/api/suppliers
    {
        "name": "fournisseurTest01"
    }
    
POST - http://localhost:3010/api/invoices
    {
        "fournisseurId": "69e0d1d48a019ccc90b27a68",
        "amount": 1000,
        "dueDate": "2026-05-07"
    }