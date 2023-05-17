DELETE 
    Aflam.Media, Aflam.CompanyHasMedia, Aflam.MediaInGenre
FROM Aflam.CompanyHasMedia
    LEFT JOIN Aflam.MediaInGenre
    ON CompanyHasMedia.MediaID = MediaInGenre.MediaID 
    LEFT JOIN Aflam.Media
    ON CompanyHasMedia.MediaID = Media.MediaID
WHERE Media.MediaID IN (1111378,1100011,3922568,960490,677118,12301);
