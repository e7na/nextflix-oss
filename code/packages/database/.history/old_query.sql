/* To clarify This is for MYSQL not Microsoft SQL Server Management Studio */
drop schema aflam;
create schema if not exists `Aflam` default character set UTF8 ;
USE `Aflam`;
-- if exists any of the tables delete them 
-- drop table if exists User;
-- drop table if exists Subscription; 
-- drop table if exists TVShowsAndMovies;
-- drop table if exists PaymentForSubscription;
-- drop table if exists Genre;
-- drop table if exists Contributor;
-- drop table if exists Country;
-- drop table if exists TVShowsMadeInCountry;
-- drop table if exists TVShowsHaveContributors;
-- drop table if exists MoviesInGenre;


Create Table User
    (
        UserID          INT            NOT Null,
        FirstName       Char(30)       Not null,
        LastName        char(30)               ,
        Gender          varchar(6)     Not null
            check (Gender in ('Male','Female')),
        Email           varchar(50)    Not Null,
        PasswordHash    Varchar(50)    Not Null,
        Address         text                   ,
        CountryID       int            			,
        PhoneNumber     varchar(14)    Not null,
        CreatedOn       timestamp      not null default now(),
        SubID           INT                    ,
        SubDate         timestamp      			,

        constraint   User_PK Primary key (UserID)
        
    );
    
    
CREATE TABLE Subscription
    (
        SubID            INT             Not Null,
        SubName          varchar(30)     Not Null,
        SubPrice         float           Not Null,
        MaxResolution    text                    ,

        CONSTRAINT Subscription_PK PRIMARY KEY (SubID)
    );
    

CREATE TABLE TVShowsAndMovies
    (
        MovieID          InT            Not Null,
        Title            VarChar(150)   Not Null,
        Rating           VarChar(10)            ,
        Duration         TIME                   ,
        PosterURL        Text                   ,
        Discription      Text                   ,
        ReleaseYear      DATE                   ,
        AddedOn          TIMESTAMP      Not Null default now(),
        FileURL          text           		,

        CONSTRAINT   TVShowsAndMovies_PK PRIMARY KEY(MovieID)
    );


CREATE TABLE PaymentForSubscription
    (
        PaymentID         InT           Not Null,
        UserID            INT           Not Null,
        SubID             INT           Not Null,
        PaidAmount        float         Not Null,
        PaymentDate       DateTime      Not Null,

        CONSTRAINT   PaymentForSubscription_PK   PRIMARY KEY (PaymentID)
    );


CREATE TABLE Genre
    (
        GenreID           int           Not Null,
        GenreName         text          Not Null,

        CONSTRAINT   Genre_PK   PRIMARY KEY (GenreID)
    );


CREATE TABLE Contributor
    (
        ContributorID       int         Not Null,
        ContributorName     text        Not Null,

        CONSTRAINT   Contributor_PK   PRIMARY KEY (ContributorID)
    );

CREATE TABLE Country
    (
        CountryID       int             Not Null,
        CountryName     VarChar(50)     Not Null,

        CONSTRAINT   Country_PK   PRIMARY KEY (CountryID)
    );

CREATE TABLE  TVShowsMadeInCountry
    (
        CountryID       int             Not Null,
        MovieID          InT            Not Null,

        CONSTRAINT PRIMARY KEY (CountryID,MovieID)
    );

CREATE TABLE  TVShowsHaveContributors
    (
        ContributorID      int          Not Null,
        MovieID            InT          Not Null,
        ContributorRole    Char(20)     Not Null,
        
        CONSTRAINT PRIMARY KEY (ContributorID,MovieID)
    );



CREATE TABLE  MoviesInGenre
    (
        GenreID       int        Not Null,
        MovieID       InT        Not Null,

        CONSTRAINT PRIMARY KEY (GenreID,MovieID)
    );

CREATE TABLE IF NOT EXISTS companies (
  CompanyID INT NOT NULL,
  CompanyName VARCHAR(45) NULL,
  PRIMARY KEY (CompanyID));


CREATE TABLE IF NOT EXISTS Companies_has_tvshowsandmovies (
  Companies_CompanyID INT NOT NULL,
  tvshowsandmovies_MovieID INT NOT NULL,
  PRIMARY KEY (Companies_CompanyID, tvshowsandmovies_MovieID),
  CONSTRAINT Companies_has_tvshowsandmovies_fk
    FOREIGN KEY (Companies_CompanyID)
    REFERENCES Companies (CompanyID),
  CONSTRAINT tvshowsandmoviesCompanies_has_Companies_fk
    FOREIGN KEY (tvshowsandmovies_MovieID)
    REFERENCES tvshowsandmovies (MovieID));
  
Alter table PaymentForSubscription add CONSTRAINT SubscriberPayment_FK
FOREIGN KEY (UserID) REFERENCES User(UserID);
Alter table PaymentForSubscription add CONSTRAINT SubscriptionPayment_FK
FOREIGN KEY (SubID) REFERENCES Subscription(SubID);

Alter table User add CONSTRAINT UserCountry_FK
FOREIGN KEY (CountryID) REFERENCES Country(CountryID);
Alter table User add CONSTRAINT UserSubscribe_FK
FOREIGN KEY User(SubID) REFERENCES PaymentForSubscription(SubID);

Alter table TVShowsMadeInCountry add CONSTRAINT CountryHasTVShow_FK
FOREIGN KEY (CountryID) REFERENCES Country(CountryID);
Alter table TVShowsMadeInCountry add CONSTRAINT TVShowsMadeInCountry_FK
FOREIGN KEY (MovieID) REFERENCES TVShowsAndMovies(MovieID);

Alter table TVShowsHaveContributors add CONSTRAINT ContributorsInMovie_FK
FOREIGN KEY (ContributorID) REFERENCES Contributor(ContributorID);
Alter table TVShowsHaveContributors add CONSTRAINT MovieHasContributors_FK
FOREIGN KEY (MovieID) REFERENCES TVShowsAndMovies(MovieID);

Alter table MoviesInGenre add CONSTRAINT GenreOfMovie_FK
FOREIGN KEY (GenreID) REFERENCES Genre(GenreID);
Alter table MoviesInGenre add CONSTRAINT MovieWithGenre_FK
FOREIGN KEY (MovieID) REFERENCES TVShowsAndMovies(MovieID);
