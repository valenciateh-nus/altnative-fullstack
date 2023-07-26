const dummyUsers = new Map([
    [user2, {
        id : 2,
        name : 'Jane Doe',
        avatar : null,
        username : 'test2@test.com',
        phoneNumber : '12345678'
    }],
    [user1, {
        id : 1,
        name : 'John Doe',
        avatar : {url: 'https://img.icons8.com/stickers/100/000000/user-male.png'},
        username : 'test1@test.com',
        phoneNumber : '12345678'
    }],
    [user3, {
        id : 3,
        name : 'Jack Doe',
        avatar : null,
        username : 'test3@test.com',
        phoneNumber : '12345678',
    }],
])

const dummyTags = [
    {
        id : 1,
        name : 'Batik'
    },
    {
        id : 2,
        name : 'Chique'
    },
    {
        id : 3,
        name : 'Skirt'
    }
]

const dummyMaterial = [
    {
        id : 1,
        name : 'Denim'
    },
    {
        id : 2,
        name : 'Cotton'
    },
    {
        id : 3,
        name : 'Polyester'
    },
]



const dummyCurrUser = {
    id : 1,
    name : 'John Doe',
    avatar : {url : 'https://img.icons8.com/stickers/100/000000/user-male.png'},
    username : 'test1@test.com'
}

const dummyCategories = {
    id: 1,
    categoryName : 'Skirts',
}

const dummyProjects = [
    {//ProjectListing
        id: 1,
        title : 'Some refashion listing',
        description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        dateCreated : new Date(),
        price : 20,
        imageList : [
            {
              url : 'https://images.unsplash.com/photo-1515865644861-8bedc4fb8344?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
            },
            {
              url : 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
            },
            {
              url : 'https://images.unsplash.com/photo-1529690086133-c8e4bc9e1f6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1711&q=80'
            },
        ],
        tagList : dummyTags,
        materialList : dummyMaterial,
        category : dummyCategory,
        isAvailable : true,
    },
    {//ProjRequest
        id: 2,
        title : 'Some refashion request',
        description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        dateCreated : new Date(),
        price : 15,
        imageList : [
            {
              url : 'https://images.unsplash.com/photo-1515865644861-8bedc4fb8344?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
            },
            {
              url : 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
            },
            {
              url : 'https://images.unsplash.com/photo-1529690086133-c8e4bc9e1f6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1711&q=80'
            },
        ],
        tagList : dummyTags,
        materialList : dummyMaterial,
        category : dummyCategory,
        requestStatus : 'PUBLISHED',
        offers : [],
        appUser : dummyUsers.get(user2),
    }
]

const dummyAddOns = [
    {
        id : 1,
        title : 'Add Zipper',
        description : 'Add Zipper',
        price : 5,
        isPaid : false,
        proposedCompletionDate : new Date('12/12/2022'),
        offerId : 319
    },

]

const dummyOffers = [
    {//refashioner making offer for a request
        id : 1234567,
        status : true,
        proposedCompletionDate: new Date('12/12/2022'),
        price : 25,
        description : 'Some random offer.',
        title : 'Some offer',
        appUser : dummyUsers[0],
        projectListing : dummyProject[1],
        projectRequest : null,
        transaction : null,
    },
]

const dummyOrders = [
    {
        offerId : 1234567,
        transactionId : 1234567,
        orderPrice : 25,
        addOns : dummyAddOns[0],
    }
]

const dummyTransactions = [
    {
        id : 1,
        amount : 25,
        dateCreated : new Date(),
        dateCompleted : new Date(),
        creditCard : null,
        offerId : 1234567,
        order2: dummyOrders[0],
        paymentStatus : 'HOLD',
    }
]

const dummyMilestones = [
    {
        id: 1,
        milestoneEnum : "ORDER_CREATED",
        details : "ALT-INV-2931",
        date : new Date("01/01/2022"),
    },
    {
        id: 2,
        milestoneEnum : "ORDER_STARTED",
        date : new Date(),
    },
    {
        id: 3,
        milestoneEnum : "ARRANGE_FOR_COURIER",
        date : new Date(),
    },
    {
        id: 4,
        milestoneEnum : "MATERIAL_LOCATION_PENDING",
        date : new Date(),
    },
    {
        id: 5,
        milestoneEnum : "LOCATION_REGISTERED",
        date : new Date(),
    },
    {
        id: 6,
        milestoneEnum : "COURIER_OTW",
        details : "Ref. ED123456789H",
        date : new Date(),
    },
    {
        id: 7,
        milestoneEnum : "COURIER_DELIVERED",
        date : new Date(),
    },
    {
        id: 8,
        milestoneEnum : "MEASUREMENTS_REQUESTED",
        date : new Date(),
    },
    {
        id: 9,
        milestoneEnum : "ADD_ON",
        details : `{"id":1,"title":"Add Zipper","description":"Add Zipper","price":100,"isPaid":true,"proposedCompletionDate":"2022-12-11T16:00:00.000Z"}`,
        date : new Date(),
    },
    {
        id: 10,
        milestoneEnum : "PAYMENT",
        date : new Date(),
        details : 5,
        price : 5,
    },
    {
        id: 11,
        milestoneEnum : "PROGRESS_UPDATE_REQUEST",
        date : new Date(),
    },
    {
        id: 12,
        milestoneEnum : "PROGRESS_UPDATE",
        date : new Date(),
        images : [
            {
              url : 'https://images.unsplash.com/photo-1515865644861-8bedc4fb8344?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
            },
            {
              url : 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
            },
            {
                url : 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
            },
            {
                url : 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
            },
        ]
    },
    {
        id: 13,
        milestoneEnum : "PENDING_FINAL_APPROVAL",
        details : `{"hasResponded": false}`,
        date : new Date(),
        images : [
            {
              url : 'https://images.unsplash.com/photo-1515865644861-8bedc4fb8344?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
            },
            {
              url : 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
            },
            {
                url : 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
            },
            {
                url : 'https://images.unsplash.com/photo-1550030085-00cee362ae48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80'
            },
        ]
    },
    {
        id: 14,
        milestoneEnum : "FINAL_APPROVAL",
        details : `{"isApproved":false, "rejectionReason": "Some reason"}`,
        date : new Date(),
    },
    {
        id: 15,
        milestoneEnum : "ARRANGE_FOR_COURIER",
        date : new Date(),
    },
    {
        id: 16,
        milestoneEnum : "FINAL_LOCATION_PENDING",
        date : new Date(),
    },
    {
        id: 17,
        milestoneEnum : "LOCATION_REGISTERED",
        date : new Date(),
    },
    {
        id: 18,
        milestoneEnum : "COURIER_OTW",
        details : "Ref. ED123456789H",
        date : new Date(),
    },
    {
        id: 19,
        milestoneEnum : "COURIER_DELIVERED",
        date : new Date("03/03/2022"),
    },
]

