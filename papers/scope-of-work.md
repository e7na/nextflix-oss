--- 
title: Nextflix Scope of Work Document
geometry: a4paper,margin=2.5cm
---

# Project Brief
Our project is to create a video streaming service that allows users to watch
movies and TV shows. The service will have different subscription tiers that
unlock different video qualities, and media availability to each user will be
controlled by its licensing status in that user's region.

The project will provide a web-based application that allows users to browse and
search a database of media from various copyright holders. Users will be able to
create accounts and select from different subscription tiers. According to a
user's region and subscription tier, the pool of searchable media will be
filtered to only show the media licensed for that region at the resolutions
unlocked by their subscription.

# Scope of Work
The streaming service's features are as follows:

- User registration and authentication
- Subscription management and expiry
- Money transactions and payment processing
- Media browsing and searching
- Search filtering by region and subscription tier
- Media playback at different resolutions
- Copyright holder registration
- Media registration through an admin panel

For this project, we will focus on the following features:

- User registration and authentication
- Media browsing and searching
- Media registration

while leaving out:

- Media playback
- Subscription management and expiry
- Payment processing

and mocking possibly licenses and company regions using random data generation with tools like Faker.js

# Deliverables
The following deliverables will be produced:

- A web-based frontend application to browse the media gallery, with an admin
  panel to register new media.
- A database to store and manage media metadata and user accounts.
- A backend API to handle user registration and authentication as well as
  database queries according to each user's session's context.
- An admin gateway for adding media records to the database.

# Future Work
After the initial iteration of developing the streaming service, potential future work
could include adding the following features:

- Database:
    - Subscription management with automatic expiry and renewal
    - Rating and reviewing media
- Backend:
    - Recommendations and personalized content suggestions
- Frontend:
    - A mobile-native application
