import API from './index'

/** ---------------------------- Edit Profile -------------------------------- */

/**  AppUser getUserById(Long id)
 * 
 *  @GetMapping("/getUserById")
    public ResponseEntity<?> getUserById(@RequestParam Long userId) {
        return ResponseEntity.ok().body(appUserService.getUserById(userId));
    } */
export const getUserById = (id) => API.get(`/api/v1/getUserById`, { params: { userId: id } });


/** uploadAvatar(AppUser user, MultipartFile file)
 * 
 * @PostMapping("/uploadAvatar")
    public ResponseEntity<?> uploadAvatar(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        AppUser user = appUserService.getUserFromToken(request);
        try {
            return ResponseEntity.ok().body(appUserService.uploadAvatar(user, file));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    } */
export const updateAvatar = (formData) => API.post(`/api/v1/uploadAvatar`, formData, {headers : {"Content-Type" : "multipart/form-data"}});


/** editName(String username, String newName)
 * 
 * @PutMapping("/{username}/changeName")
    public ResponseEntity<?> changeName(@PathVariable String username, @RequestBody String newName) {
        try {
            appUserService.editName(username, newName);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    } 
*/
export const updateName = (username, newName) => API.put(`/api/v1/${username}/changeName`, newName, {headers : {'Content-Type': 'application/json; charset=utf-8'}});


/** editPhoneNumber(String username, String newPhone)
 * 
 * @PutMapping("/{username}/changePhone")
    public ResponseEntity<?> changePhoneNumber(@PathVariable String username, @RequestBody String newPhoneNumber) {
        try {
            appUserService.editPhoneNumber(username, newPhoneNumber);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    } 
*/
export const updateNumber = (username, newPhoneNumber) => API.put(`/api/v1/${username}/changePhone`, newPhoneNumber, {headers : {'Content-Type': 'application/json; charset=utf-8'}});


/** void addDeliveryAddress(String address) 
 * 
 *  @PutMapping("/{username}/addDeliveryAddress")
    public ResponseEntity<?> addDeliveryAddress(@PathVariable String username, @RequestBody String address) {
        try {
            appUserService.addDeliveryAddress(username, address);
            return ResponseEntity.ok().body("Address modified successfully!");
        } catch (UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
*/
export const updateAddress = (username, address) => API.put(`/api/v1/${username}/addDeliveryAddress`, address, {headers : {'Content-Type': 'application/json; charset=utf-8'}});


/** AppUser editPassword(String username, String newPassword)
 * 
 * @PutMapping(value="/{username}/changePassword",
            consumes={MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_JSON_VALUE} )
    public ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody String newPassword) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/user/{username}/changePassword").toUriString());
        try {
            appUserService.editPassword(username, newPassword);
            return ResponseEntity.created(uri).body(appUserService.editPassword(username, newPassword));
        } catch (UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    } 
*/
export const changePassword = (username, newPassword) => API.put(`/api/v1/${username}/changePassword`, newPassword, {headers : {'Content-Type': 'application/json; charset=utf-8'}});

/* -------------------------------- My Measurements ---------------------------------*/

/** Measurement retrieveMeasurementByUsername(String username)
 * 
 * @GetMapping("/measurementByUsername")
    public ResponseEntity<?> retrieveMeasurementByUsername(@RequestParam String username) {
        try {
            return ResponseEntity.ok().body(measurementService.retrieveMeasurementByUsername(username));
        } catch (MeasurementNotFoundException | UserDoesNotExistException | UserNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } 
*/
export const retrieveMeasurementByUsername = (username) => API.get(`/api/v1/measurementByUsername`, null, { params: { username: username } });

export const retrieveMeasurements = () => API.get(`/api/v1/getMeasurements`);

/*
    @PutMapping("/updateMeasurements")
    public ResponseEntity<?> updateMeasurements(@Valid @RequestBody Measurement measurement) {
        try {
            return ResponseEntity.ok().body(measurementService.updateMeasurement(measurement));
        } catch (MeasurementNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } */
export const updateMeasurments = (formData) => API.put(`/api/v1/updateMeasurements`, formData);



/* ----------------------------------- Favourites -------------------------------------------- */

/** List<ProjectListing> retrieveFavouritedProjectListings()
 * 
    @GetMapping("/projectListing/favourites")
    public ResponseEntity<?> retrieveFavouritedProjectListings() {
        return ResponseEntity.ok().body(projectListingService.retrieveFavouritedProjectListings());
    }
*/
export const retrieveFavouritedProjectListings = () => API.get(`/api/v1/projectListing/favourites`);

/**
 * void favouriteProjectListing(Long id)
    @PostMapping("/projectListing/favourite/{id}")
    public ResponseEntity<?> favouriteProjectListingById(@PathVariable Long id) throws ProjectListingNotFoundException, ProjectListingAlreadyFavouritedException {
        try {
            projectListingService.favouriteProjectListing(id);
            return ResponseEntity.ok().body("Project listing with id: " + id + " favourited successfully");
        } catch (ProjectListingNotFoundException | ProjectListingAlreadyFavouritedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } 
*/
export const favouriteProjectListing = (id) => API.post(`/api/v1/projectListing/favourite/${id}`);


/** 
 *  void unfavouriteProjectListing(Long id)
 *  @PostMapping("/projectListing/unfavourite/{id}")
    public ResponseEntity<?> unfavouriteProjectListingById(@PathVariable Long id) throws ProjectListingNotFoundException, FavouriteNotFoundException {
        try {
            projectListingService.unfavouriteProjectListing(id);
            return ResponseEntity.ok().body("Project listing with id: " + id + " unfavourited successfully");
        } catch (ProjectListingNotFoundException | FavouriteNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } 
*/
export const unfavouriteProjectListing = (id) => API.post(`/api/v1/projectListing/unfavourite/${id}`);


/*
    @GetMapping("/refashioner/favourites")
    public ResponseEntity<?> retrieveFavouritedRefashioners() {
        return ResponseEntity.ok().body(refashionerService.retrieveFavouritedRefashioners());
    } 
*/
export const retrieveFavouritedRefashioners = () => API.get(`/api/v1/refashioner/favourites`);


/*
    @PostMapping("/refashioner/favourite/{id}")
    public ResponseEntity<?> favouriteRefashionerById(@PathVariable Long id) throws RefashionerNotFoundException, RefashionerAlreadyFavouritedException, NotARefashionerException {
        try {
            refashionerService.favouriteRefashioner(id);
            return ResponseEntity.ok().body("Refashioner with id: " + id + " favourited successfully");
        } catch (RefashionerNotFoundException | RefashionerAlreadyFavouritedException | NotARefashionerException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } 
*/
export const favouriteRefashionerById = (id) => API.post(`/api/v1/refashioner/favourite/${id}`);

/*
    @PostMapping("/refashioner/unfavourite/{id}")
    public ResponseEntity<?> unfavouriteRefashionerById(@PathVariable Long id) throws UserDoesNotExistException, FavouriteNotFoundException {
        try {
            refashionerService.unfavouriteRefashioner(id);
            return ResponseEntity.ok().body("Refashioner with id: " + id + " unfavourited successfully");
        } catch (UserDoesNotExistException | FavouriteNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
*/
export const unfavouriteRefashionerById = (id) => API.post(`/api/v1/refashioner/unfavourite/${id}`);

/* ----------------------------- Project Listings ------------------------------------- */

/*
    @PostMapping("/categories/{cId}/projectListings")
    public ResponseEntity<?> createProjectListing(@PathVariable Long cId, @RequestPart ProjectListing projectListing, @RequestPart(value="files", required=false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/categories/{cId}/projectListing").toUriString());
        try {
            return ResponseEntity.ok().body(projectListingService.createProjectListing(cId, projectListing, files));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
*/
export const createProjectListing = (cId, formData) => API.post(`/api/v1/categories/${cId}/projectListings`, formData);


// Backend do not have a retrieve only function, so i just use search without any keywords.
export const retrieveOwnProjectListings = () => API.get("/api/v1/myProjectListings/search");


/*
    @GetMapping("/projectListing/refashioner/{refashionerId}")
    public ResponseEntity<?> retrieveProjectListingsByRefashionerId(@PathVariable Long refashionerId) {
        try {
            return ResponseEntity.ok().body(projectListingService.retrieveProjectListingsByRefashionerId(refashionerId));
        } catch (ProjectListingNotFoundException | NotARefashionerException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
*/
export const retrieveProjectListingsByRefashionerId = (refashionerId) => API.get(`/api/v1/projectListing/refashioner/${refashionerId}`);

/*
    @GetMapping("/projectListing/{id}")
    public ResponseEntity<?> retrieveProjectListingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(projectListingService.retrieveProjectListingById(id));
        } catch (ProjectListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } 
*/
export const retrieveProjectListingById = (id) => API.get(`/api/v1/projectListing/${id}`);


/*
    @PutMapping("/projectListing")
    public ResponseEntity<?> updateProjectListing(@Valid @RequestBody ProjectListing projectListing) {
        try {
            return ResponseEntity.ok().body(projectListingService.updateProjectListing(projectListing));
        } catch (ProjectListingNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } */
export const updateProjectListing = (formData) => API.put(`/api/v1/projectListing`, formData);


/*
    @PostMapping("/projectListing/{projectListingId}")
    public ResponseEntity<?> addImageToProjectListing(@PathVariable Long projectListingId, @RequestPart(value="file", required=true) MultipartFile file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectListing/{projectListingId}").toUriString());
        try {
            projectListingService.addImageToProjectListing(projectListingId, file);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } */
export const addImageToProjectListing = (projectListingId, files) => API.post(`api/v1/projectListing/${projectListingId}`, files);


/*
    @PostMapping("/projectListing/{projectListingId}/image/{imageId}")
    public ResponseEntity<?> removeImageFromProjectListing(@PathVariable Long projectListingId, @PathVariable Long imageId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectListing/{projectListingId}/image/{imageId}").toUriString());
        try {
            projectListingService.removeImageFromProjectListing(projectListingId, imageId);
            return ResponseEntity.ok().build();
        } catch (NoAccessRightsException | ProjectListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } */
export const removeImageFromProjectListing = (projectListingId, imageId) => API.post(`api/v1/projectListing/${projectListingId}/image/${imageId}`);

/*  
    @DeleteMapping("/projectListing/delete/{id}")
    public ResponseEntity<?> deleteProjectListingById(@PathVariable Long id) {
        try {
            projectListingService.deleteProjectListing(id);
            return ResponseEntity.ok().body("Project Listing with ID: " + id + " deleted successfully.");
        } catch (ProjectListingNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } */
export const deleteProjectListingById = (id) => API.delete(`/api/v1/projectListing/delete/${id}`);


/* ------------------------------- Reviews -------------------------------------- */

/*
    @GetMapping("/users/reviewsById")
    public ResponseEntity<?> retrieveReviewsByUserId(@RequestParam Long id) {
        try {
            return ResponseEntity.ok().body(reviewService.retrieveReviewsByUserId(id));
        } catch (NoReviewsFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } 
*/
export const retrieveReviewsByUserId = (userId) => API.get(`/api/v1/users/reviewsById`, { params: { id: userId } });


/*  Review createReview(Review review)
 *
    @PostMapping("/review")
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/reviews/createReview").toUriString());
        return ResponseEntity.created(uri).body(reviewService.createReview(review));
    } */
export const createReview = (formData) => API.post(`/api/v1/review`, formData);


/*
    @DeleteMapping("/review/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok().body("Review with ID: " + id + " deleted successfully.");
        } catch (ReviewNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } 
*/
export const deleteReview = (id) => API.delete(`/api/v1/review/delete/${id}`);


export const retrieveRefashionerRegistrationRequestsByUserId = (userId) => API.get(`/api/v1/refashionerRegistrationRequest/user/${userId}`)

export const deactivateAccount = (username) => API.put(`/api/v1/deactivate/${username}`) 


/* Editing User Profile */

 export const addExpertise = (expertise) => API.post(`/api/v1/refashioner/addExpertise`, expertise);

 export const deleteExpertise = (expertise) => API.post(`/api/v1/refashioner/deleteExpertise`, expertise);

// export const addRefashionerDesc = (refashionerDesc) => API.post(`/api/v1/refashioner/addRefashionerDesc`, refashionerDesc);

export const updateRefashionerDesc = (refashionerDesc) => API.post(`/api/v1/refashioner/updateRefashionerDesc`, refashionerDesc, {headers : {'Content-Type': 'application/json; charset=utf-8'}});


/*
    @PostMapping("/experiences")
    public ResponseEntity<?> createListOfExperiences(@Valid @RequestBody List<Experience> experiences) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/experiences/createListOfExperiences").toUriString());
        return ResponseEntity.created(uri).body(expertiseService.createListOfExperiences(experiences));
    } */
export const createListOfExperiences = (experiences) => API.post(`/api/v1/experiences`, experiences);

/*
    @DeleteMapping("/expertise/delete/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id) {
        try {
            expertiseService.deleteExperience(id);
            return ResponseEntity.ok().body("Expertise with ID: " + id + " deleted successfully.");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } */
export const deleteExperience = (id) => API.delete(`/api/v1/expertise/delete/${id}`);

/*
    @PostMapping("/experiences/updateExperiences")
    public ResponseEntity<?> updateExperience(@Valid @RequestBody List<Experience> experiences) {
        try {
            return ResponseEntity.ok().body(expertiseService.updateListOfExperiences(experiences));
        } catch (ExperienceNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } */
export const updateExperience = (experiences) => API.post(`/api/v1/experiences/updateExperiences`, experiences);

/*
    @PostMapping("/refashioner/addCertification")
    public ResponseEntity<?> addCertification(@RequestParam("certification") MultipartFile certification) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/refashioner/addCertification").toUriString());
        try {
            return ResponseEntity.ok().body(refashionerService.addCertification((Image) certification));
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    } */
export const addCertification = (certification) => API.post(`/api/v1/refashioner/addCertification`, certification)

export const getUserByUsername = (username) => API.get(`/api/v1/users/${username}`);

export const getUserByRoles = (role) => API.get(`/api/v1/users/roles/${role}`);

export const suspendUser = (username) => API.put(`/api/v1/suspend/${username}`);

export const unblockUser = (username) => API.put(`/api/v1/unblock/${username}`);
