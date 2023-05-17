ALTER TABLE aflam.tvshowsandmovies MODIFY COLUMN AddedON timestamp default now();
ALTER TABLE aflam.tvshowsandmovies ADD COLUMN mtype Varchar(10) check (mtype in ('Movie','Series'));
Alter TABLE aflam.tvshowsandmovies DROP COLUMN Rating;
Alter table aflam.tvshowsandmovies add column Rating Double(6,3) check (Rating between 0 and 100 );
Alter table aflam.tvshowsandmovies add column Popularity Double(6,3) check (Popularity between 0 and 100 );

Create Table Regions 
	( 	Region_Code Int ,
		Regon_Name varchar(15),		
        Country_ID	INT,
        CONSTRAINT   Regions_PK PRIMARY KEY (Region_Code),
        CONSTRAINT RegionCountries_FK FOREIGN KEY (Country_ID) REFERENCES `Country`(CountryID)
    );
