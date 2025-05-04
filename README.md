# Hotel List Project

A simple Hotel List Application that used frontend as **Next.js** with **Django** as backend to list and bookmark the hotels for the users. 

---

## Project Description
This Hotel List project have used backend as Django to build a API endpoints for frontend using an external hotel API("https://developer.hotelbeds.com/"). The frontend have developed in Next.Js with some React components and Tailwind CSS to design the UI. 


The web application have the following funtionality:

- **Stack** :
    - *Frontend* : Next.js
    - *Backend* : Django
    - *Database* : MySQL (Used Django ORM to build the database)


- **Authentication** : 
    - SignUp
    - Login
    - Logout

    > Used JWT to generates refresh token and access token. Both token have been used in the authenticated process.

- **Search & Filters** :
    - *Seach by Location* : Anyone can search the hotels from the homepage, but to view the results user need to sign in.
    - *Filters* : Authenticated users can filter the hotels based on price range, star rating of hotels and rooms, order the hotels based on price. User can filter the hotels by using check in and check out date, the number of rooms, adults and childrens.

    - View Details : Vissible button but not Implemnented yet.

    > Since there is no data about the Swimming pool in the source API, so it cant't be possible to filter by Pool Available.


- **Bookmark Feature** :
    - *Add or remove* : User can bookmark any searched hotels. Also later it can be removed from the bookmark.
    - *View Bookmark* : User can view their bookmark in a page.
    - *Search & Filter* : User can search by hotels name and can filter the hotels in bookmark list. 

- **Appearance Toggle** : User can change the Appearance of the UI between dark and light mode using a button.


- **API & Database** : For the frontend, API endpoints have created in Django. These Django API endpoints can fetch and update the data to the MySQL database and have the fetch function of some external API(""https://developer.hotelbeds.com/").


---

## 🛠️ Setup and Installation Instructions (For Locally)

### 🔸 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Python](https://www.python.org/downloads/) (3.11 or newer)
- [pip](https://pip.pypa.io/en/stable/)

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


## 🛠️ API Testing in Django (Locally)

- POST : http://localhost:8000/accounts/login/ 

- POST : http://localhost:8000/accounts/signup/

- POST : http://localhost:8000/accounts/logout/

- POST : http://localhost:8000/hotels/search/

- GET : http://localhost:8000/hotels-details (Not Used in FrontEnd)

- GET : http://localhost:8000/bookmarks/

- GET : http://localhost:8000/bookmarks/search/

- POST : http://localhost:8000/bookmarks/

- DELETE : http://localhost:8000/bookmarks/





<br>


## 🛠️ Database Schemes



<br>


## 🛠️ Data Handeling & Source API

### Option B (From a API source):

In this project, multiple API endpoints have used from "https://developer.hotelbeds.com/". Fetched the hotel code, hotel description, hotel address, hotel city, hotel country, min_rate, max rate, rating, currancy. Avg price rate was calculated from minimum and maximum price. Also many query parameter have passed to filter the hotels. All the possible errors have been handled through exception handling and used Asynchronous Tasks in frontend to prevent UI blocking.

### Source API Endpoints :

HOTELBEDS_HOTEL_API_URL : "https://api.test.hotelbeds.com/hotel-api/1.0/hotels"
HOTELBEDS_HOTEL_CONTENT_API_URL : "https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels"
HOTELBEDS_HOTEL_BOOKING_API_URL : "https://api.test.hotelbeds.com/hotel-api/1.0/hotels"




For more documentations : "https://developer.hotelbeds.com/documentation/getting-started/"

<br>


## 🛠️ Screenshot of the Functionallity

![image](https://github.com/user-attachments/assets/f56e99ff-6df7-4b62-b61c-12b8090713b4)

![image](https://github.com/user-attachments/assets/45b67a28-9ed8-4364-a61e-14c056a7b0da)

![image](https://github.com/user-attachments/assets/5e90a9f2-1ad8-4a0d-a0a5-c37353e76f28)

![image](https://github.com/user-attachments/assets/48d6aa59-78eb-4921-8935-2c5063660078)


![image](https://github.com/user-attachments/assets/2fba8230-d19b-47cb-8819-241ffb143dd6)



![image](https://github.com/user-attachments/assets/6a8163df-a4ab-4f0b-aaab-e7802668039d)

![image](https://github.com/user-attachments/assets/29a03011-f24f-4abb-b39b-dd778ef238e9)


![image](https://github.com/user-attachments/assets/9db5dcb8-91d8-46bd-9a4e-96ca272b10d9)


![image](https://github.com/user-attachments/assets/7379a49b-1bf3-464e-ab35-aff80a477562)








![image](https://github.com/user-attachments/assets/829a800f-d3d8-4e28-a6ca-63839824f865)



![image](https://github.com/user-attachments/assets/f1b16922-3609-4a67-bcfb-81bd89deaf2d)


![image](https://github.com/user-attachments/assets/024211cb-83f8-485d-9ada-e6b1a3cb708d)


![image](https://github.com/user-attachments/assets/a955eaa0-261d-4f48-93ee-2f55f109bc8d)






![image](https://github.com/user-attachments/assets/06897cf3-ee9b-4367-8685-57e49ef30076)




![image](https://github.com/user-attachments/assets/f36805d0-3c4e-4b63-a12f-9382f0f78d17)



![image](https://github.com/user-attachments/assets/b3e51187-851b-45d2-bf33-216ec2668c7f)




![image](https://github.com/user-attachments/assets/6d7bf9d4-6347-401d-8d77-11f4fe997224)



![image](https://github.com/user-attachments/assets/71d80070-fed3-4f51-9713-00731741b983)


![image](https://github.com/user-attachments/assets/e955300e-1f6d-4c76-8892-09828b798652)


![image](https://github.com/user-attachments/assets/e022b96d-72c5-4ff9-ae00-2f94b060ca7e)


![image](https://github.com/user-attachments/assets/caa0b357-248c-4b5a-9c59-bafb601513ad)


![image](https://github.com/user-attachments/assets/e29c13e6-2fee-4820-a270-3ae3d87e83d3)



<br>


## 🛠️ AI Tools Used

- ChatGPT : Used to understand the structer of the Next.js, react component and Tailwind CSS. Also used for understanding the class based ORM in Django. Used to solve the problem related dockerizations. 

- GitHub Copilot : Used the model Claude 3.7 Sonnet to generates the UI templete and react components. Also used to understand the API integration related problems.
