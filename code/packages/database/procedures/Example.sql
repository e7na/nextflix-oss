/* To Create a Simple procedure that takes the country from the user 
	and returns the list of the Title of the media available in his region 
    and their categories and their copy holders
*/

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `test`(IN user_country char(2))
BEGIN
	SELECT m.Title, m.Category, c.CompanyName
    FROM Media m
    INNER JOIN CompanyHasMedia cm ON m.MediaID = cm.MediaID
    INNER JOIN Companies c ON cm.CompanyID = c.CompanyID
    INNER JOIN companyinregion cr ON cr.CompanyID = c.CompanyID
    INNER JOIN Regions r ON cr.CompanyRegion = r.RegionID 
    AND r.CountryID = user_country ;

END$$
DELIMITER ;

-- To Call it 
CALL `aflam`.`test`("EG");
