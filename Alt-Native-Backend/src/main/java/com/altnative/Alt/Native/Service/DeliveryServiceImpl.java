package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DeliveryForm;
import com.altnative.Alt.Native.Dto.jnt.Tracking;
import com.altnative.Alt.Native.Enum.DeliveryStatus;
import com.altnative.Alt.Native.Enum.MilestoneEnum;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.DeliveryRepo;
import com.altnative.Alt.Native.Repository.MilestoneRepo;
import com.altnative.Alt.Native.Repository.Order2Repo;
import com.altnative.Alt.Native.Repository.SwapRequestRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DeliveryServiceImpl implements DeliveryService {
    private final DeliveryRepo deliveryRepo;
    private final MilestoneRepo milestoneRepo;
    private final Order2Repo order2Repo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final Order2Service order2Service;
    private final SwapRequestService swapRequestService;
    private final SwapRequestRepo swapRequestRepo;

//    @Override
//    public Delivery createDelivery(Long orderId) throws OrderNotFoundException, NoAccessRightsException {
//        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
//        Order2 order = order2Service.retrieveOrderById(orderId);
//
//        if (order.getAppUserUsername().equalsIgnoreCase(loggedInUser.getUsername())) { //logged in user is a refashionee
//            String refashionerAdd = appUserService.getUser(order.getRefashionerUsername()).getAddress();
//            Delivery d = new Delivery();
//            d.setOriginAddress(loggedInUser.getAddress());
//            d.setDestinationAddress(refashionerAdd);
//            d.setCreationDate(Calendar.getInstance().getTime());
//            d.setDeliveryStatus(DeliveryStatus.CONTACTING_COURIER);
//
//            deliveryRepo.save(d);
//            deliveryRepo.flush();
//
//            Milestone m = new Milestone();
//            m.setDate(Calendar.getInstance().getTime());
//            m.setMilestoneEnum(MilestoneEnum.ARRANGE_FOR_COURIER);
//            m.setOfferId(order.getOfferId());
//            m.setOrderId(order.getId());
//            m.setRemarks("Delivery has been arranged.");
//            milestoneRepo.save(m);
//
//            order.getMilestones().add(m);
//            order.getDeliveries().add(d);
//            order2Repo.save(order);
//            return d;
//        } else if (order.getRefashionerUsername().equalsIgnoreCase(loggedInUser.getUsername())) {//logged in user is refashioner
//            String refashioneeAdd = appUserService.getUser(order.getAppUserUsername()).getAddress();
//            Delivery d = new Delivery();
//            d.setOriginAddress(loggedInUser.getAddress());
//            d.setDestinationAddress(refashioneeAdd);
//            d.setCreationDate(Calendar.getInstance().getTime());
//            d.setDeliveryStatus(DeliveryStatus.CONTACTING_COURIER);
//
//            deliveryRepo.save(d);
//            deliveryRepo.flush();
//
//            Milestone m = new Milestone();
//            m.setDate(Calendar.getInstance().getTime());
//            m.setMilestoneEnum(MilestoneEnum.ARRANGE_FOR_COURIER);
//            m.setOfferId(order.getOfferId());
//            m.setOrderId(order.getId());
//            m.setRemarks("Delivery has been arranged.");
//            milestoneRepo.save(m);
//
//            order.getMilestones().add(m);
//            order.getDeliveries().add(d);
//            order2Repo.save(order);
//            return d;
//        } else {
//            throw new NoAccessRightsException("You do not have access to this method!");
//        }
//    }

    @Override
    public Delivery createDelivery(Long orderId, DeliveryForm deliveryForm) throws OrderNotFoundException, NoAccessRightsException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        Order2 order = order2Service.retrieveOrderById(orderId);

        if (order.getAppUserUsername().equalsIgnoreCase(loggedInUser.getUsername()) || order.getRefashionerUsername().equalsIgnoreCase(loggedInUser.getUsername())) { //logged in user is a refashionee
            Delivery d = new Delivery();
            d.setOriginAddress(deliveryForm.getOrigin());
            d.setDestinationAddress(deliveryForm.getDestination());
            d.setCreationDate(Calendar.getInstance().getTime());
            d.setArrangedDate(deliveryForm.getArrangedDate());
            d.setParcelWeight(deliveryForm.getWeight());
            d.setParcelHeight(deliveryForm.getHeight());
            d.setParcelWidth(deliveryForm.getWidth());
            d.setParcelLength(deliveryForm.getLength());
            d.setDeliveryStatus(DeliveryStatus.CONTACTING_COURIER);
            d.setSenderUsername(loggedInUser.getUsername());
            d.setOrder(order);
            if (loggedInUser.getUsername().equalsIgnoreCase(order.getAppUserUsername())) {
                d.setReceiverUsername(order.getRefashionerUsername());
            } else {
                d.setReceiverUsername(order.getAppUserUsername());
            }

            deliveryRepo.save(d);

            Milestone m = new Milestone();
            m.setDate(Calendar.getInstance().getTime());
            m.setMilestoneEnum(MilestoneEnum.ARRANGE_FOR_COURIER);
            m.setOfferId(order.getOfferId());
            m.setOrderId(order.getId());
            m.setRemarks(d.getId().toString());
            milestoneRepo.save(m);

            order.getMilestones().add(m);
            order.getDeliveries().add(d);
            order2Repo.save(order);
            return d;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public Delivery createDeliveryForSwapItem(Long orderId, DeliveryForm deliveryForm) throws ItemNotFoundException, NoAccessRightsException, OrderNotFoundException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        System.out.println("Logged in user " + loggedInUser.getUsername());
        Order2 order = order2Service.retrieveOrderById(orderId);
        System.out.println("Input order id is: " + orderId);
        System.out.println("Actual order id is: " + order.getId());

        if (order.getAppUserUsername().equalsIgnoreCase(loggedInUser.getUsername()) || loggedInUser.getRoles().contains(Role.ADMIN)) {
            Delivery d = new Delivery();
            d.setOriginAddress(deliveryForm.getOrigin());
            d.setDestinationAddress(deliveryForm.getDestination());
            d.setCreationDate(Calendar.getInstance().getTime());
            d.setArrangedDate(deliveryForm.getArrangedDate());
            d.setParcelWeight(deliveryForm.getWeight());
            d.setParcelHeight(deliveryForm.getHeight());
            d.setParcelWidth(deliveryForm.getWidth());
            d.setParcelLength(deliveryForm.getLength());
            d.setDeliveryStatus(DeliveryStatus.CONTACTING_COURIER);
            d.setSenderUsername("Alt.native");
            d.setOrder(order);
            d.setReceiverUsername(order.getAppUserUsername());
            deliveryRepo.save(d);

            Milestone m = new Milestone();
            m.setDate(Calendar.getInstance().getTime());
            m.setMilestoneEnum(MilestoneEnum.ARRANGE_FOR_COURIER);
            m.setOrderId(order.getId());
            m.setRemarks(d.getId().toString());
            milestoneRepo.save(m);

            order.getMilestones().add(m);
            order.getDeliveries().add(d);
            order2Repo.save(order);
            return d;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public Delivery createDeliveryForSwapRequest(Long swapRequestId, DeliveryForm deliveryForm) throws SwapRequestNotFoundException, NoAccessRightsException {
        //this method is for rejected swap request items that have been requested to be delivered back
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        SwapRequest swapRequest = swapRequestService.retrieveSwapRequestById(swapRequestId);

        if (swapRequest.getAppUser().getUsername().equalsIgnoreCase(loggedInUser.getUsername())) {
            Delivery d = new Delivery();
            d.setOriginAddress(deliveryForm.getOrigin());
            d.setDestinationAddress(deliveryForm.getDestination());
            d.setCreationDate(Calendar.getInstance().getTime());
            d.setArrangedDate(deliveryForm.getArrangedDate());
            d.setParcelWeight(deliveryForm.getWeight());
            d.setParcelHeight(deliveryForm.getHeight());
            d.setParcelWidth(deliveryForm.getWidth());
            d.setParcelLength(deliveryForm.getLength());
            d.setDeliveryStatus(DeliveryStatus.CONTACTING_COURIER);
            d.setSenderUsername(loggedInUser.getUsername());
            d.setReceiverUsername(loggedInUser.getUsername());

            deliveryRepo.save(d);

            swapRequest.getDeliveries().add(d);
            swapRequestRepo.save(swapRequest);
            return d;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public Delivery updateCourierByDeliveryId(String courierName, Long deliveryId, Long orderId) throws OrderNotFoundException, NoAccessRightsException, DeliveryNotFoundException {
        Order2 order = order2Service.retrieveOrderById(orderId);
        Optional<Delivery> deliveryOptional = deliveryRepo.findById(deliveryId);
        if (deliveryOptional.isEmpty()) {
            throw new DeliveryNotFoundException("Delivery with id: " + deliveryId + " not found!");
        }
        Delivery delivery = deliveryOptional.get();
        delivery.setCourierName(courierName);

        Milestone m = new Milestone();
        m.setDate(Calendar.getInstance().getTime());
        m.setMilestoneEnum(MilestoneEnum.COURIER_OTW);
        m.setOfferId(order.getOfferId());
        m.setOrderId(order.getId());
        m.setRemarks("Courier has been arranged.");
        milestoneRepo.save(m);

        order.getMilestones().add(m);
        order2Repo.save(order);
        return delivery;
    }

    @Override
    public Delivery retrieveDeliveryById(Long deliveryId) throws DeliveryNotFoundException {
        Optional<Delivery> deliveryOptional = deliveryRepo.findById(deliveryId);
        if (deliveryOptional.isEmpty()) {
            throw new DeliveryNotFoundException("Delivery with id: " + deliveryId + " not found!");
        } else {
            return deliveryOptional.get();
        }
    }

    @Override
    public List<Delivery> retrieveDeliveriesInOrder(Long orderId) throws OrderNotFoundException, NoAccessRightsException, NoDeliveryExistsException {
        Order2 order2 = order2Service.retrieveOrderById(orderId);
        if (order2.getDeliveries() == null) {
            order2.setDeliveries(new ArrayList<>());
            throw new NoDeliveryExistsException("There are no deliveries in order with orderId: " + orderId + ".");
        } else if (order2.getDeliveries().isEmpty()) {
            throw new NoDeliveryExistsException("There are no deliveries in order with orderId: " + orderId + ".");
        } else {
            return order2.getDeliveries();
        }
    }

    @Override
    public void deleteDeliveryByDeliveryId(Long deliveryId) throws DeliveryNotFoundException {
        Delivery d = retrieveDeliveryById(deliveryId);
        deliveryRepo.delete(d);
    }

    @Override
    public Delivery updateDelivery(Delivery delivery) throws DeliveryNotFoundException {
        Delivery deliveryToUpdate = retrieveDeliveryById(delivery.getId());
        deliveryToUpdate.setCourierName(delivery.getCourierName());
        deliveryToUpdate.setTrackingNumber(delivery.getTrackingNumber());
        deliveryToUpdate.setDestinationAddress(delivery.getDestinationAddress());
        deliveryToUpdate.setOriginAddress(delivery.getOriginAddress());
        deliveryToUpdate.setParcelDescription(delivery.getParcelDescription());
        deliveryToUpdate.setParcelWeight(delivery.getParcelWeight());
        deliveryRepo.save(deliveryToUpdate);
        deliveryRepo.flush();
        return deliveryToUpdate;
    }

    @Override
    public List<Delivery> retrieveAllDeliveriesByCourier(String courierName) throws NoDeliveryExistsException {
        List<Delivery> deliveries = new ArrayList<>();
        deliveries = deliveryRepo.findAllByCourierName(courierName);
        if (deliveries == null || deliveries.isEmpty()) {
            throw new NoDeliveryExistsException("There are no deliveries under courier: " + courierName + ".");
        } else {
            return deliveries;
        }
    }

    //    @Override
//    public Mono<String> testing() {
//        WebClient client = WebClient.builder()
////                .baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep")
//                .baseUrl("http://localhost:8080")
//                .defaultCookie("cookieKey", "cookieValue")
//                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
////                .defaultUriVariables(Collections.singletonMap("url", "https://uat-jts.jtexpress.sg/jts-service-doorstep"))
//                .defaultUriVariables(Collections.singletonMap("url", "http://localhost:8080"))
//                .build();
//        WebClient.UriSpec<WebClient.RequestBodySpec> uriSpec = client.method(HttpMethod.GET);
////        WebClient.RequestBodySpec bodySpec = uriSpec.uri("/api/gateway/v1/distribution-points");
//        WebClient.RequestBodySpec bodySpec = uriSpec.uri("/api/v1/users");
//
//        LinkedMultiValueMap map = new LinkedMultiValueMap();
//        map.add("key1", "value1");
//        map.add("key2", "value2");
//        WebClient.RequestHeadersSpec<?> headersSpec = bodySpec.body(
//                BodyInserters.fromMultipartData(map));
//
//        System.out.println("HeadersSpec: " + headersSpec.retrieve().toString());
//
//        WebClient.ResponseSpec responseSpec = headersSpec.header(
//                        HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
//                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML)
//                .acceptCharset(StandardCharsets.UTF_8)
//                .ifNoneMatch("*")
//                .ifModifiedSince(ZonedDateTime.now())
//                .retrieve();
//
//        System.out.println("responseSpec: " + responseSpec.toString());
//        Mono<String> response = headersSpec.retrieve()
//                .bodyToMono(String.class);
//        response = headersSpec.exchangeToMono(response -> {
//            if (response.statusCode()
//                    .equals(HttpStatus.OK)) {
//                return response.bodyToMono(String.class);
//            } else if (response.statusCode()
//                    .is4xxClientError()) {
//                return Mono.just("Error response");
//            } else {
//                return response.createException()
//                        .flatMap(Mono::error);
//            }
//        });
//        return response;
//    }
    @Override
    public Flux<String> fetchLockerStationList(String token) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();
        return webClient.get()
                .uri("/api/locker/v1/getLockerStationList")
                .header("Authorization", "JWT " + token)
//                        Base64Utils
//                        .encodeToString((token).getBytes(UTF_8)))
                .retrieve()
                .bodyToFlux(String.class);
    }

    @Override
    public Flux<String> fetchDistributionPoints(String token, String service_code) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();

        List<String> collectionPoints = new ArrayList<>();

        Flux<String> stringFlux = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/gateway/v1/distribution-points")
                        .queryParam("service_code", service_code).build())
                .header("Authorization", "JWT " + token)
                .retrieve()
                .bodyToFlux(String.class);

        collectionPoints = stringFlux.collectList().block();
        return stringFlux;
    }

    @Override
    public List<String> fetchDistributionPointsAsList(String token, String service_code) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();

        List<String> collectionPoints = new ArrayList<>();

        Flux<String> stringFlux = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/gateway/v1/distribution-points")
                        .queryParam("service_code", service_code).build())
                .header("Authorization", "JWT " + token)
                .retrieve()
                .bodyToFlux(String.class);

        collectionPoints = stringFlux.collectList().block();
        return collectionPoints;
    }

    @Override
    public String createJNTDelivery(String token, Long deliveryId) throws DeliveryNotFoundException, JNTDeliveryCreationError {
        Delivery delivery = retrieveDeliveryById(deliveryId);

        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();

        String originAddress = delivery.getOriginAddress();
        String[] originParts = originAddress.split(" ");
        String originPostalCode = originParts[originParts.length-1];
//        System.out.println("Origin postal code: " + originPostalCode);

        String destinationAddress = delivery.getDestinationAddress();
        String[] destinationParts = destinationAddress.split(" ");
        String destinationPostalCode = destinationParts[destinationParts.length-1];

        val body = "{\n" +
                "    \"service_code\":\"DOM123\",\n" +
                "    \"pickup_details\": {\n" +
                "        \"contact_name\": \"" + appUserService.getUser(delivery.getSenderUsername()).getName() + "\",\n" +
                "        \"phone_number\": \"" + appUserService.getUser(delivery.getSenderUsername()).getPhoneNumber() + "\",\n" +
                "        \"address\": \"" + delivery.getOriginAddress() + "\",\n" +
                "        \"email\": \"" + delivery.getSenderUsername() + "\",\n" +
                "        \"postcode\": \"" + originPostalCode + "\",\n" +
                "        \"country_code\": \"SG\",\n" +
                "        \"date\": \"" + delivery.getArrangedDate() + "\"\n" +
                "    },\n" +
                "    \"consignee_details\": {\n" +
                "        \"contact_name\": \"" + appUserService.getUser(delivery.getReceiverUsername()).getName() + "\",\n" +
                "        \"phone_number\": \"" + appUserService.getUser(delivery.getReceiverUsername()).getPhoneNumber() + "\",\n" +
                "        \"address\": \"" + delivery.getDestinationAddress() + "\",\n" +
                "        \"email\": \"" + delivery.getReceiverUsername() + "\",\n" +
                "        \"postcode\": \"" + destinationPostalCode + "\",\n" +
                "        \"country_code\": \"SG\"\n" +
                "    },\n" +
                "    \"item_details\": [{\n" +
                "        \"weight\": \"" + delivery.getParcelWeight() + "\",\n" +
                "        \"weight_unit\": \"G\",\n" +
                "        \"quantity\": 1,\n" +
                "        \"description\": \"" + delivery.getParcelDescription() + "\"\n" +
                "    }]\n" +
                "}";

        Flux<String> fluxString = webClient.post()
                .uri(uriBuilder -> uriBuilder.path("/api/gateway/v1/deliveries").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(body))
                .header("Authorization", "JWT " + token)
                .retrieve()
                .bodyToFlux(String.class);

        String s = fluxString.collectList().block().get(0);
        System.out.println(s);
        String[] parts = s.split(":");

        String tracking = parts[1];
        String[] parts1 = tracking.split("\"");

        String trackingNumber = parts1[1];
        if (trackingNumber.equalsIgnoreCase("message")) {
            String errorMsg = parts[2];
            String[] errorMsgParts = errorMsg.split("\"");
            String error = errorMsgParts[1];
            throw new JNTDeliveryCreationError("Error with JNT Delivery: " + error);
        }
        System.out.println("Tracking number: " + trackingNumber);

        delivery.setTrackingNumber(trackingNumber);
        deliveryRepo.saveAndFlush(delivery);
        return trackingNumber;
    }

    //probably wont be used
    @Override
    public Flux<String> schedulePickup(String token, Long deliveryId, String jntTrackingId) throws DeliveryNotFoundException {
        Delivery delivery = retrieveDeliveryById(deliveryId);

        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();

        val body = "{\n" +
                "  \"ids\": [\n" +
                "    \"" + jntTrackingId +"\"\n" +
                "  ],\n" +
                "  \"pickup_details\": {\n" +
                "    \"address\": \"" + delivery.getOriginAddress() + "\",\n" +
                "    \"contact_name\": \"" + appUserService.getUser(delivery.getReceiverUsername()).getName() + "\",\n" +
                "    \"email\": \"" + delivery.getReceiverUsername() + "\",\n" +
                "    \"phone_number\": \"" + appUserService.getUser(delivery.getReceiverUsername()).getPhoneNumber() + "\",\n" +
                "    \"postcode\": \"123456\"\n" +
                "  }\n" +
                "}";

        return webClient.patch()
                .uri(uriBuilder -> uriBuilder.path("/api/gateway/v1/deliveries/pickup").build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(body))
                .header("Authorization", "JWT " + token)
                .retrieve()
                .bodyToFlux(String.class);
    }

    // not sure if it works on JNT side, but i keep getting rate 0 even if i change the values
    @Override
    public Flux<String> getServicePricing(String token, Double weight, Double length, Double width, Double height) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/gateway/v1/services/price")
                        .queryParam("weight", weight)
                        .queryParam("length", length)
                        .queryParam("width", width)
                        .queryParam("height", height)
                        .queryParam("service_code", "PUDO")
                        .queryParam("country_code", "SG")
                        .queryParam("weight_unit", "G").build())
                .header("Authorization", "JWT " + token)
                .retrieve()
                .bodyToFlux(String.class);
    }

    @Override
    public Mono<Tracking> getJNTStatus(String token, Long deliveryId) throws DeliveryNotFoundException {
        Delivery d = retrieveDeliveryById(deliveryId);
        String jntTrackingId = d.getTrackingNumber();
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();
        String path = "/api/gateway/v1/track/" + jntTrackingId;
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path(path)
                        .build())
                .header("Authorization", "JWT " + token)
                .retrieve()
                .bodyToMono(Tracking.class);
    }

    //returns you link for JNT invoice url
    @Override
    public String getJNTInvoice(String token, String jntTrackingId) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();
        String path = "/api/gateway/v1/invoiceLable/" + jntTrackingId;
        Flux<String> linkFlux = webClient.get()
                .uri(uriBuilder -> uriBuilder.path(path)
                        .build())
                .header("Authorization", "JWT " + token)
                .retrieve()
                .bodyToFlux(String.class);

        String link = linkFlux.collectList().block().get(0);
        String[] linkParts = link.split("\"");
        return linkParts[linkParts.length-2];
    }
}


