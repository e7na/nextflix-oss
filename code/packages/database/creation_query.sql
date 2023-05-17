/* To clarify This is for MYSQL not Microsoft SQL Server Management Studio */
-- drop schema aflam;
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


CREATE TABLE User (
    UserID          INT             NOT NULL AUTO_INCREMENT,
    FirstName       Char(30)                               ,
    LastName        char(30)                               ,
    Gender          ENUM('Male', 'Female')                 ,
    Email           varchar(50)     NOT NULL               ,
    PasswordHash    Varchar(50)     NOT NULL               ,
    Address         text                                   ,
    CountryID       CHAR(2)                                ,
    PhoneNumber     varchar(14)                            ,
    CreatedOn       timestamp       NOT NULL DEFAULT NOW() ,
    SubID           INT,
    SubDate         timestamp,

    CONSTRAINT User_PK PRIMARY KEY (UserID)
);

CREATE TABLE Subscription (
    SubID           INT             NOT NULL AUTO_INCREMENT,
    SubName         varchar(30)     NOT NULL               ,
    SubPrice        DECIMAL(6, 3)   NOT NULL               ,
    MaxResolution   text                                   ,

    CONSTRAINT Subscription_PK PRIMARY KEY (SubID)
);

CREATE TABLE Media (
    MediaID         InT                     NOT NULL                ,
    Category        ENUM('Movie', 'TV')     NOT NULL                ,
    Title           VarChar(150)            NOT NULL                ,
    PosterURL       Text                                            ,
    BackdropURL     Text                                            ,
    Description     Text                                            ,
    ReleaseYear     DATE                                            ,
    AddedOn         TIMESTAMP               DEFAULT NOW()           ,
    Rating          FLOAT(6, 3) CHECK (Rating BETWEEN 0 AND 100)    ,
    Popularity      FLOAT(6, 3) CHECK (Popularity BETWEEN 0 AND 100),

    CONSTRAINT Media_PK PRIMARY KEY(MediaID)
);

CREATE TABLE PaymentForSubscription (
    PaymentID   InT         NOT NULL AUTO_INCREMENT,
    UserID      INT         NOT NULL               ,
    SubID       INT         NOT NULL               ,
    PaidAmount  float       NOT NULL               ,
    PaymentDate DateTime    NOT NULL               ,

    CONSTRAINT PaymentForSubscription_PK PRIMARY KEY (PaymentID)
);

CREATE TABLE Genre (
    GenreID     int     NOT NULL,
    GenreName   text    NOT NULL,

    CONSTRAINT Genre_PK PRIMARY KEY (GenreID)
);

CREATE TABLE Country (
    CountryID   CHAR(2)     NOT NULL,
    -- the actual longest name is 44 chars
    CountryName VarChar(55) NOT NULL,

    CONSTRAINT Country_PK PRIMARY KEY (CountryID)
);

CREATE TABLE Companies (
    CompanyID   INT         NOT NULL,
    CompanyName VARCHAR(45) NULL    ,
    
    PRIMARY KEY (CompanyID)
);

CREATE TABLE CompanyHasMedia (
    CompanyID   INT     NOT NULL    ,
    MediaID     INT     NOT NULL    ,

    PRIMARY KEY (CompanyID, MediaID),

    CONSTRAINT CompanyHasMedia_FK FOREIGN KEY (CompanyID) 
        REFERENCES Companies (CompanyID),
    CONSTRAINT MediaHasCompanies_FK FOREIGN KEY (MediaID)
        REFERENCES Media(MediaID)
);

CREATE TABLE MediaInGenre (
    GenreID     int     NOT NULL,
    MediaID     InT     NOT NULL,

    CONSTRAINT PRIMARY KEY (GenreID, MediaID)
);

CREATE TABLE Regions (
    RegionID    Int    ,
    CountryID   CHAR(2),

    CONSTRAINT RegionCountries_FK FOREIGN KEY (CountryID) 
        REFERENCES Country(CountryID)
);

ALTER TABLE Regions ADD CONSTRAINT
Regions_PK2 PRIMARY KEY (RegionID, CountryID);

CREATE TABLE CompanyInRegion (
    CompanyID       INT NOT NULL,
    CompanyRegion   INT NOT NULL,

    PRIMARY KEY (CompanyID, CompanyRegion),

    CONSTRAINT CompanyInRegion_FK FOREIGN KEY (CompanyID) 
        REFERENCES Companies (CompanyID),
    CONSTRAINT RegionHasCompanies_FK FOREIGN KEY (CompanyRegion)
        REFERENCES Regions(RegionID)
);

ALTER TABLE PaymentForSubscription ADD CONSTRAINT
SubscriberPayment_FK FOREIGN KEY (UserID) REFERENCES User(UserID);
ALTER TABLE PaymentForSubscription ADD CONSTRAINT
SubscriptionPayment_FK FOREIGN KEY (SubID) REFERENCES Subscription(SubID);

ALTER TABLE User ADD CONSTRAINT
UserCountry_FK FOREIGN KEY (CountryID) REFERENCES Country(CountryID);
ALTER TABLE User ADD CONSTRAINT
UserSubscribe_FK FOREIGN KEY User(SubID) REFERENCES PaymentForSubscription(SubID);

ALTER TABLE MediaInGenre ADD CONSTRAINT
GenreOfMedia_FK FOREIGN KEY (GenreID) REFERENCES Genre(GenreID);
ALTER TABLE MediaInGenre ADD CONSTRAINT
MediaWithGenre_FK FOREIGN KEY (MediaID) REFERENCES Media(MediaID);


source ./data/countries.sql
source ./data/country-region.sql
source ./data/companies.sql
source ./data/company-region.sql
source ./data/genres.sql
source ./data/media.sql
source ./data/media-genre.sql
source ./data/media-company.sql
source ./data/removeAdult.sql
