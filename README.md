# Hotel List Project

A full-stack application that combines a **React + Tailwind CSS frontend** with a **Django backend** to assist users in smart decision-making and navigation. The system processes data in real-time and provides guidance to users through a clean and interactive interface.

---

## Project Description

This project is designed to simulate a smart assistant system that helps users navigate or make decisions based on environmental and system data. The **frontend** handles user interaction and display, while the **backend** processes logic, decision-making, and data handling. The architecture is modular and extendable to integrate machine learning models in the future.

---

## 🛠️ Setup and Installation Instructions (For Locally)

### 🔸 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Python](https://www.python.org/downloads/) (3.8 or newer)
- [pip](https://pip.pypa.io/en/stable/)
- [virtualenv](https://virtualenv.pypa.io/) (optional but recommended)

---

### 🔸 Clone the Repository

```bash
git clone https://github.com/ashik5757/Hotel-List-Project.git
cd Hotel-List-Project
```

Open two terminal or Git Bash in following directory : 
1. Django (Backend API Server)
```bash
cd hotel_list_backend
```
2. Node.js (Frontend Server)
```bash
cd hotel_list_frontend
```

<br>

---

### 🔸 Backend Setup (Django)

1. Open Django Diretory
```bash
cd hotel_list_backend
```
> Note: Skip this, if you're already in this directory:

2. Install all the requirements.
```bash
pip install -r requirements.txt
```

3. Create the Database in MySQL

- Log in to the mysql client :

```bash
mysql -u root -p
```

> Note : If the root user don't have any password, then Press **Enter** without typing the password.

- Create a database :

```bash
CREATE DATABASE hotel_lister_db;
```

- Modify the **settings.py** as followings :


```bash
MYSQL_DATABASE_NAME = 'hotel_lister_db'
MYSQL_USER = 'sub-root'
MYSQL_PASSWORD = '1234'
```
> Note : If the root user have password, then put the password in the ***settings.py***. If you use a another user, then change the user and password accordingly.

Example:

```bash
MYSQL_DATABASE_NAME = 'hotel_lister_db'
MYSQL_USER = 'sub-root'
MYSQL_PASSWORD = '1234'
```


> If you're using MySQL Workbench, then open or create a connection and create a new database. Then Modify the **settings.py** as the connection database name, username and password.




4. Apply database migrations

> Note : Please exit from mysql client in terminal before executing No. 4 command. (Type ***exit*** and press enrter)

```bash
python manage.py migrate   
```




5. Run the Server
```bash        
python manage.py runserver
```

<br>

---
### 🔸 Frontend Setup (React + Tailwind CSS)

1. Open NodeJs Frontend Diretory
```bash
cd hotel_list_frontend
```

2. Install all frontend dependencies

```bash
npm install       
```
3. Run the frontend server

```bash
npm run dev
```

<br>

---
### 🔸 Running Application on browser

> Note : Run two server at different terminal.

Django:

```bash        
python manage.py runserver
```

NodeJs:

```bash
npm run dev
```


Django Server will be run at : http://localhost:8000
<br>
Frontend Serevr can access through browser at : http://localhost:3000



<br>

## 🛠️ Run in DOCKER

1. Clone and open root directory :
```bash
git clone https://github.com/ashik5757/Hotel-List-Project.git
cd Hotel-List-Project
```

2. Open ***docker-compose.yml*** and modify as follwing:

If the root password have empty



<br>


## 🛠️ API Testing in Django





<br>


## 🛠️ Database Schemes



<br>


## 🛠️ Data Handeling & Source API

Option A: Manual Data Handling

This project uses local file/database handling through Django’s built-in ORM and SQLite database. Data is not dependent on external services or cloud databases, making it easier to test and deploy locally.

<br>


## 🛠️ Screenshot of the Functionallity


<br>


## 🛠️ AI Tools Used