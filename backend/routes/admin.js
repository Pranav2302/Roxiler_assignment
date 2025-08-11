import express from "express"
import { getAllStores,getAllUsers,getDashboardStats,getUserDetails,addStore,addUser } from "../controller/Admin.js"
import {auth,isAuthorized,isNormalUser,isStoreOwner,isSystemAdmin} from "../middleware/auth.js"
import { changePassword } from "../controller/common.js"

import { getOwnerDashboard,getMyStore,getMyStoreRatings } from "../controller/StoreOwner.js";
import { getAllStoreForRating,getMyRatings,submitRating } from "../controller/NormalUser.js";

const router = express.Router();

// routes for admin
router.get('/admin/dashboard',auth,isSystemAdmin,getDashboardStats);

router.get('/admin/users',auth,isSystemAdmin,getAllUsers);

router.get('/admin/stores',auth,isSystemAdmin,getAllStores);
router.get('/admin/users/:userId',auth,isSystemAdmin,getUserDetails);
router.post('/admin/users',auth,isSystemAdmin,addUser);
router.post('/admin/stores',auth,isSystemAdmin,addStore);


//routes for store owner
router.get('/owner/mystore',auth,isStoreOwner,getMyStore); //remaining

router.get('/owner/myratings',auth,isStoreOwner,getMyStoreRatings);  //remaining to make
router.get('/owner/dashboard',auth,isStoreOwner,getOwnerDashboard);  //error here check afterwards



//for normal users
router.get('/stores',auth,isNormalUser,getAllStoreForRating);

router.get('/myrating',auth,isNormalUser,getMyRatings);
router.post('/submitrating',auth,isNormalUser,submitRating);



// update password 
router.put('/changepassword', auth, isAuthorized('SYSTEM_ADMIN', 'STORE_OWNER', 'NORMAL_USER'), changePassword);

export default router;