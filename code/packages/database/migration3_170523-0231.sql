CREATE TABLE CompanyAgents (
    Passkey CHAR(48) UNIQUE PRIMARY KEY,
    CompanyID INT NOT NULL,
    CONSTRAINT CompanyHasAgent_FK FOREIGN KEY (CompanyID)
        REFERENCES Companies (CompanyID)
);

source ./data/agents.sql
