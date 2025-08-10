import express from "express"
import { getAllStores,getAllUsers,getDashboardStats,getUserDetails,addStore,addUser } from "../controller/Admin.js"

import {auth,isAuthorized,isNormalUser,isStoreOwner,isSystemAdmin} from "../middleware/auth.js"

const router = express.Router();

// routes for admin
router.get('/admin/dashboard',auth,isSystemAdmin,getDashboardStats);

router.get('/admin/users',auth,isSystemAdmin,getAllUsers);

router.get('/admin/stores',auth,isSystemAdmin,getAllStores);



//routes for store owner
router.get('/owner/mystore',auth,isStoreOwner,get); //remaining

router.get('/owner/myrating',auth,isStoreOwner,getmystorerating);  //remaining to make

router.get('/owner/dashboard',auth,isStoreOwner,getownerdashboard);



//for normal users
router.get('/stores',auth,isNormalUser,getAllStoresforrating);

router.get('/myrating',auth,isNormalUser,getmyrating);


// Both Admin and Normal User can view stores (different purposes)
router.get('/stores', auth, isAuthorized('SYSTEM_ADMIN', 'NORMAL_USER'), getStores);

// update password 
router.put('/change-password', auth, isAuthorized('SYSTEM_ADMIN', 'STORE_OWNER', 'NORMAL_USER'), changePassword);