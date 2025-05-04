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

    <br>

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


- **API & Database** : For the frontend, API endpoints have created in Django. These Django API endpoints can fetch and update the data to the MySQL database and have the fetch function of some external API (https://developer.hotelbeds.com/).


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
2. Next.js (Frontend Server)
```bash
cd hotel_list_frontend
```

<br>

---

### 🔸 Backend Setup (Django)

1. **Open Django Diretory**
    ```bash
    cd hotel_list_backend
    ```
    > Note: Skip this, if you're already in this directory:

2. **Install all the requirements**.
    ```bash
    pip install -r requirements.txt
    ```

3. **MySQL Database create and configuration**

- Log in to the mysql client :

    ```bash
    mysql -u root -p
    ```

    > Note : If the root user don't have any password, then Press **Enter** without typing the password.

- Create a mysql database :

    ```bash
    CREATE DATABASE hotel_lister_db;
    ```

- Modify the **settings.py** as followings :


    ```bash
    MYSQL_DATABASE_NAME = 'hotel_lister_db'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = ''
    ```
    > Note : If the root user have password, then put the password in the ***settings.py***. If you use a another user, then change the user and password accordingly.

    Example:

    ```bash
    MYSQL_DATABASE_NAME = 'hotel_lister_db'
    MYSQL_USER = 'sub-root'
    MYSQL_PASSWORD = '1234'
    ```


    > If you're using MySQL Workbench, then open or create a connection and create a new database. Then Modify the **settings.py** as the connection database name, username and password.


    <br>

    Make sure the lines for Local MySQL Database are ***not commented***. You have to remove or comment the lines for Docker as this :
    ```bash
    # For Local MySQL Database
    MYSQL_DATABASE_NAME = 'hotel_lister_db'
    MYSQL_USER = 'sub-root'
    MYSQL_PASSWORD = '1234'
    MYSQL_HOST = 'localhost'


    # For Docker FIle
    # MYSQL_DATABASE_NAME = os.environ.get('DB_NAME', 'hotel_lister_db')
    # MYSQL_USER = os.environ.get('DB_USER', 'sub-root')
    # MYSQL_PASSWORD = os.environ.get('DB_PASSWORD', '1234')
    # MYSQL_HOST = os.getenv("DB_HOST", "localhost")
    ```


4. **Apply database migrations**

    > Note : Please exit from mysql client in terminal before executing No. 4 command. (Type ***exit*** and press enrter)

    ```bash
    python manage.py migrate   
    ```




5. **Run the Server**
    ```bash        
    python manage.py runserver
    ```

<br>

---
### 🔸 Frontend Setup (React + Tailwind CSS)

1. **Open Next.js Frontend Diretory**
```bash
cd hotel_list_frontend
```

2. **Install all frontend dependencies**

```bash
npm install       
```
3. **Run the frontend server**

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
Frontend Server can access through browser at : http://localhost:3000



<br>

## 🛠️ Run in DOCKER

### 🔸 Prerequisites

Make sure you have installed Docker in your device : [Docker](https://www.docker.com/get-started/)

 

### 🔸 Clone and open root directory :

```bash
git clone https://github.com/ashik5757/Hotel-List-Project.git
cd Hotel-List-Project
```


### 🔸 Open ***docker-compose.yml*** and modify as follwing :

- ***Find the follwing lines and replace the root password with your MySQL root password.***

    ```bash
    environment:
        MYSQL_DATABASE: hotel_lister_db_docker
        MYSQL_USER: hotel_app_user
        MYSQL_PASSWORD: 1234
        MYSQL_ROOT_PASSWORD: REPLACE_WITH_YOUR_MYSQL_ROOT_PASSWORD
    ```

    Example:
    ```bash
      MYSQL_ROOT_PASSWORD: 12345678
    ```

    > Note : **No Need** to change the other attributes like MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD
    
    <br>

- ***If your root password is empty, then follow as this :***

    ```bash
    environment:
      MYSQL_DATABASE: hotel_lister_db_docker
      MYSQL_USER: hotel_app_user
      MYSQL_PASSWORD: 1234
      # MYSQL_ROOT_PASSWORD: Your Can remove this attribute 
      MYSQL_ALLOW_EMPTY_PASSWORD: "yes"
    ```


### 🔸 Modify ***settings.py*** as following :


- Remove or Comment the following lines:

    ```bash
    # For Local MySQL Database
    # MYSQL_DATABASE_NAME = 'hotel_lister_db'
    # MYSQL_USER = 'sub-root'
    # MYSQL_PASSWORD = '1234'
    # MYSQL_HOST = 'localhost'
    ```


- Ensure the following lines are ***not commented***:

    ```bash
    # For Docker FIle
    MYSQL_DATABASE_NAME = os.environ.get('DB_NAME', 'hotel_lister_db')
    MYSQL_USER = os.environ.get('DB_USER', 'sub-root')
    MYSQL_PASSWORD = os.environ.get('DB_PASSWORD', '1234')
    MYSQL_HOST = os.getenv("DB_HOST", "localhost")
    ```

### 🔸 Composer Build :

- Stop the MySQL service if it is running (*Ohterwise skip this step*):

    > open Services > FInd MySQL80 and stop the service.
- Open *terminal* in root directory :

    > NOTE : Make sure you're in the root directory : 

    ```bash
    Hotel-List-Project/           # root 
    ├── docker-compose.yml
    ├── hotel_list_backend/       # Django (Backend)
    │   ├── Dockerfile
    │   └── ...
    └── hotel_list_frontend/      # Next.js (frontend)
        ├── Dockerfile
        └── ...
    ```


- Run to ***build*** :

    ```bash
    docker-compose up --build
    ```

    Django Server will be run at : http://localhost:8000
    <br>
    Frontend Server can access through browser at : http://localhost:3000

    > ***NOTE*** : It could restart few times while build. And aslo make sure docker is running before building it.

- Only for starting :
    ```bash
    docker-compose up
    ```
    Press ***Ctrl+c*** to stop all the contaner in the terminal.



### 🔸 Container Remove :
- Run to remove all the container :

    ```bash
    docker-compose down
    ```

- Run to Remove Volume to prevent any Django related issues :
    ```bash
    docker volume rm hotel-list-project_mysql_data
    ```






<br>


## 🛠️ API Testing in Django

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

<!-- 
## 🛠️ Database Schemes -->



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

### Home page

- Light Mode: 

![image](https://github.com/user-attachments/assets/f56e99ff-6df7-4b62-b61c-12b8090713b4)

- Dark Mode: 

![image](https://github.com/user-attachments/assets/45b67a28-9ed8-4364-a61e-14c056a7b0da)

### Search From the Home Page

![image](https://github.com/user-attachments/assets/5e90a9f2-1ad8-4a0d-a0a5-c37353e76f28)

### SignUp Page

![image](https://github.com/user-attachments/assets/48d6aa59-78eb-4921-8935-2c5063660078)

### Login page

![image](https://github.com/user-attachments/assets/2fba8230-d19b-47cb-8819-241ffb143dd6)


### Password Validation

![image](https://github.com/user-attachments/assets/6a8163df-a4ab-4f0b-aaab-e7802668039d)

![image](https://github.com/user-attachments/assets/29a03011-f24f-4abb-b39b-dd778ef238e9)


### NavBar

![image](https://github.com/user-attachments/assets/7379a49b-1bf3-464e-ab35-aff80a477562)

![image](https://github.com/user-attachments/assets/9db5dcb8-91d8-46bd-9a4e-96ca272b10d9)



### Search & Filter

![image](https://github.com/user-attachments/assets/829a800f-d3d8-4e28-a6ca-63839824f865)

![image](https://github.com/user-attachments/assets/f1b16922-3609-4a67-bcfb-81bd89deaf2d)

![image](https://github.com/user-attachments/assets/f36805d0-3c4e-4b63-a12f-9382f0f78d17)

- Order the hotel list

![image](https://github.com/user-attachments/assets/e022b96d-72c5-4ff9-ae00-2f94b060ca7e)



### Bookmark Add


![image](https://github.com/user-attachments/assets/024211cb-83f8-485d-9ada-e6b1a3cb708d)


### Bookmark View Page

![image](https://github.com/user-attachments/assets/a955eaa0-261d-4f48-93ee-2f55f109bc8d)



### Search Bookmark by name



![image](https://github.com/user-attachments/assets/06897cf3-ee9b-4367-8685-57e49ef30076)

### Remove Bookmark

![image](https://github.com/user-attachments/assets/b3e51187-851b-45d2-bf33-216ec2668c7f)


### Animated Loading List



![image](https://github.com/user-attachments/assets/6d7bf9d4-6347-401d-8d77-11f4fe997224)




### No Hotel Found


![image](https://github.com/user-attachments/assets/71d80070-fed3-4f51-9713-00731741b983)


### Loading Splash Screen


![image](https://github.com/user-attachments/assets/e955300e-1f6d-4c76-8892-09828b798652)


### Error handling for the API failed

![image](https://github.com/user-attachments/assets/caa0b357-248c-4b5a-9c59-bafb601513ad)


![image](https://github.com/user-attachments/assets/e29c13e6-2fee-4820-a270-3ae3d87e83d3)



<br>


## 🛠️ AI Tools Used

- ChatGPT : Used to understand the structer of the Next.js, react component and Tailwind CSS. Also used for understanding the class based ORM in Django. Used to solve the problem related dockerizations. 

- GitHub Copilot : Used the model Claude 3.7 Sonnet to generates the UI templete and react components. Also used to understand the API integration related problems.
