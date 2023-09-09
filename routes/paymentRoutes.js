import { Router } from "express";
import { allPayments, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from "../controllers/paymentController.js";
import { authorizedRoles, isLoggedIn } from "../middleware/authMiddleware.js";

const router=Router();

router
    .route('/razorpay-key')
    .get(
        isLoggedIn,
        getRazorpayApiKey
        );

router
    .route('/subcription')
    .post(
        isLoggedIn,
        buySubscription
        )

router  
    .route('/verify')
    .post(
        isLoggedIn,
        verifySubscription
        )

router  
    .route('/unsubscription')
    .post(
        isLoggedIn,
        cancelSubscription
        )

router
    .route('/')
    .get(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        allPayments
        );


export default router;