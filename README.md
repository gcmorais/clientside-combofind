# Combofind
<p align='left'>
	<a href='https://opensource.org/license/mit'><img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=8257E5&labelColor=000000"></a>
	
</p>

## <a name="apresentation">Introduction</a>

Search the site to create a Counter-Strike 2 inventory by typing in the skin name and returning based on color and available budget.

## <a name="techsUsage">Technologies Used</a>

For this project I used the following technologies and why:

**Client-side**

``Nextjs``: Since I already work with the react ecosystem, I wanted to create with next because of the familiarity and SEO, since it is more easily indexed by search engines (since the original idea was to make it available online).

``TailwindCSS``: Because of the ease of construction and standardization it offers, and the integration with several interface libraries.

``ShadnUI``: It offers customization using tailwind, componentization and because it is made in React it works natively with hooks and the lifecycle.

**Server-side**

``.NET``: I am looking to develop in the language, so it was my first choice for the server side, since I consider it a robust and reliable technology.

``Entity Framework Core (EF Core)``: I used an ORM because it simplifies access to the database by working with objects instead of dealing directly with SQL, adding less complexity to the project. I chose EF Core entirely because I was familiar with the tool, but there are other options, such as Dapper, for example.

``SQL Server``: A robust relational database for building one-to-many tables. I thought about using MongoDB to reduce database costs, but I added some relationship concepts to the project and had to switch to a relational database.

``Identity and JWT``: Since the project specifications required an administrator login to manage operations, I used identity to authenticate users, since it has native features for this. I used JWT to authenticate the API. As soon as the admin logs in, a token is generated that allows changes to the API that had protected routes.

``Clean Architecture and CQRS``: I used it only for study purposes, since it adds complexity that is not necessary in this project, since it is a small application that will not be scaled.

## <a name="basicUsage">Basic Usage</a>

Follow these steps to set up the project locally on your machine.


**Prerequisites**
<a name="prerequisites"></a>

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [.NET 8.0](https://dotnet.microsoft.com/pt-br/download/dotnet/8.0)
- [Visual Studio](https://visualstudio.microsoft.com/pt-br/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [SQL Server Express](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16)


## Server-side

**Cloning the server-side Repository**
<a name="cloning"></a>

```bash
git clone https://github.com/gcmorais/serverside-combofind.git
cd serverside-combofind
```

**Installation**
<a name="installation"></a>

Open the solution in Visual Studio to automatically install the project dependencies.

```bash
combofind.sln
```

> [!note]
>
>  Run the `dotnet restore` command, the .NET CLI uses NuGet to look for these dependencies and download them if necessary. 


**Connect to the database**
<a name="connectdb"></a>

We first need to connect to the database, so in the <strong>appsettings.json</strong> file in `DefaultConnection` in the server tag you will put the name of your server that was created in SQL Server Express;

```env
"DefaultConnection": "server= localhost\\Example; database= ExampleDB; trusted_connection=true; trustservercertificate=true"
```

I used the database connection via Windows authentication, so use the tag `trusted_connection = true;` 

if you need it, use the tags `user id=login;` `password=password;` see if it makes sense in your use case.

**Configure JWT Token**
<a name="connectdb"></a>

Now let's configure our jwt token, so in the <strong>appsettings.json</strong> navigate to the `Jwt` property and change the following information:

```env
"Jwt": {
    "Key": "your_key_here",
    "Issuer": "combofind",
    "Audience": "your_client_side_address_here"
}
```

**Running the Project**
<a name="running"></a>

First, let's run the migrations to create the tables for our database.
To do this, we'll open the Package Manager Console and issue the command:

```bash
add-migration FirstMigration
```

If the above command does not generate the migrations, open the *src* folder via terminal and type:

```bash
dotnet ef migrations add AddInitialMigration --startup-project combofind.WebApi --project combofind.Infrastructure
```

After the Build successful message is returned from the console, use the following command to actually create the modifications within the database:

```bash
update-database

or by terminal:

dotnet ef database update --project combofind.Infrastructure --startup-project combofind.WebApi
```


Run your project (CRTL + F5 in visual studio) to open [Swagger](https://swagger.io/) in your browser to view the project.

## Client-side

**Cloning the server-side Repository**
<a name="cloning"></a>

```bash
git clone https://github.com/gcmorais/clientside-combofind
cd clientside-combofind
```

**Installation client-side**
<a name="installation"></a>

Open the folder through visual studio code and access the terminal, passing the following command:

```bash
npm install
```

**Connect to the server-side**
<a name="connectsvs"></a>

To connect the client to the application backend, navigate to the index page `src/pages` and change the localhost to the one generated after starting the server-side application.


**Running the Project**
<a name="running"></a>

After connecting to the server side, open the terminal and start the client:

```bash
npm run dev
```

If you have any questions or ideas, I'm available to talk. Thank you and I hope you make good use of it. 