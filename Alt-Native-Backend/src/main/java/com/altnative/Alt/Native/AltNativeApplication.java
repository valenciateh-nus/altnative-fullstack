package com.altnative.Alt.Native;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.ImageRepo;
import com.altnative.Alt.Native.Service.*;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;

@SpringBootApplication
public class AltNativeApplication {

	public static void main(String[] args) {
		SpringApplication.run(AltNativeApplication.class, args);
	}

//	@Bean
//	FirebaseMessaging firebaseMessaging() throws IOException {
//		GoogleCredentials googleCredentials = GoogleCredentials
//				.fromStream(new ClassPathResource("firebase-service-account.json").getInputStream());
//		FirebaseOptions firebaseOptions = FirebaseOptions
//				.builder()
//				.setCredentials(googleCredentials)
//				.build();
//		FirebaseApp app = FirebaseApp.initializeApp(firebaseOptions, "my-app");
//		return FirebaseMessaging.getInstance(app);
//	}

	@Bean
	public PasswordEncoder passwordEncoder()
	{
		return new BCryptPasswordEncoder();
	}

	/*
	* for dummy data to be inserted into db
	*/
	@Bean
	CommandLineRunner run(AppUserService appUserService, CategoryService categoryService, ImageRepo imageRepo, AnalyticsService analyticsService) {
		return args -> {
			if(appUserService.getUsers().size() == 0) {
				appUserService.createDummyUser(new AppUser("test1@test.com", "password", "test1", "12345678", true), false);
				appUserService.createDummyUser(new AppUser("test2@test.com", "password", "test2", "12345678", true), false);
				appUserService.createDummyUser(new AppUser("test3@test.com", "password", "test3", "12345678", true), false);
				appUserService.createDummyUser(new AppUser("admin1@test.com", "password", "admin", "12345678", true), false);
				appUserService.createDummyUser(new AppUser("deactivate@test.com", "password", "deactivate", "12345678", true), false);
				appUserService.createDummyUser(new AppUser("business@test.com", "password", "Business", "12345678", true), true);

				appUserService.addRole("business@test.com", Role.USER_BUSINESS.name());
				appUserService.addRole("admin1@test.com", Role.ADMIN.name());
				appUserService.addRole("test1@test.com", Role.USER_REFASHIONER.name());
				appUserService.addRole("test2@test.com", Role.USER_REFASHIONER.name());

				Image newImage = new Image();
				newImage.setPath("altnative-media-upload/8");
				newImage.setFileName("icons8-skirt-40.png");
				newImage.setUrl("https://s3.ap-southeast-1.amazonaws.com/altnative-media-upload/8/icons8-skirt-40.png");
				Image newImage1 = imageRepo.saveAndFlush(newImage);
				categoryService.createCategoryDb(new Category("Skirt"), newImage1);

				Image newImage2 = new Image();
				newImage2.setPath("altnative-media-upload/8");
				newImage2.setFileName("icons8-shorts-64.png");
				newImage2.setUrl("https://s3.ap-southeast-1.amazonaws.com/altnative-media-upload/8/icons8-shorts-64.png");
				Image newImage21 = imageRepo.saveAndFlush(newImage2);
				categoryService.createCategoryDb(new Category("Shorts"), newImage21);

				Image newImage3 = new Image();
				newImage3.setPath("altnative-media-upload/8");
				newImage3.setFileName("icons8-top-64.png");
				newImage3.setUrl("https://s3.ap-southeast-1.amazonaws.com/altnative-media-upload/8/icons8-top-64.png");
				Image newImage31 = imageRepo.saveAndFlush(newImage3);
				categoryService.createCategoryDb(new Category("Top"), newImage31);

				Image newImage4 = new Image();
				newImage4.setPath("altnative-media-upload/8");
				newImage4.setFileName("icons8-denim-jacket-64.png");
				newImage4.setUrl("https://s3.ap-southeast-1.amazonaws.com/altnative-media-upload/8/icons8-denim-jacket-64.png");
				Image newImage41 = imageRepo.saveAndFlush(newImage4);
				categoryService.createCategoryDb(new Category("Denim"), newImage41);

				Image newImage5 = new Image();
				newImage5.setPath("altnative-media-upload/8");
				newImage5.setFileName("icons8-dress-60.png");
				newImage5.setUrl("https://s3.ap-southeast-1.amazonaws.com/altnative-media-upload/8/icons8-dress-60.png");
				Image newImage51 = imageRepo.saveAndFlush(newImage5);
				categoryService.createCategoryDb(new Category("Dress"), newImage51);

				Image newImage6 = new Image();
				newImage6.setPath("altnative-media-upload/8");
				newImage6.setFileName("icons8-cardigan-60.png");
				newImage6.setUrl("https://s3.ap-southeast-1.amazonaws.com/altnative-media-upload/8/icons8-cardigan-60.png");
				Image newImage61 = imageRepo.saveAndFlush(newImage6);
				categoryService.createCategoryDb(new Category("Outerwear"), newImage61);

				analyticsService.createRecord(new AdminRecord());
			}
		};
	}
}
