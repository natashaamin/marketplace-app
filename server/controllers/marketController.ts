import { Request, Response } from 'express';
import * as marketServices from '../services/marktetService';

export const getListOfMarketPlace = (req: Request, res: Response): void => {
    const getListOfMarketItems = marketServices.listOfMarketItems();
    res.status(200).send(getListOfMarketItems)
}

export const postBidding = (req: Request, res: Response): void => {
    const { quantity, startTime, closeTime, price } = req.body;
    const user = req.user as { userId: string }; 
    const currentDate = new Date().toISOString().split('T')[0];

    if (!user || !user.userId) {
        res.status(401).json({ 
            code: "ACCESS_DENIED",
            message: "Unauthorized" });
    }

    if (!quantity || !startTime || !closeTime || !price) {
        res.status(400).json({ 
            code: "PARAM_MISSING",
            message: 'Missing required fields'
         });
    }

    marketServices.storeBidding({ 
        userId: user.userId, 
        currentDate: currentDate,
        quantity, startTime, 
        closeTime, price, 
        status: marketServices.EStatus.PENDING});
   
    res.status(200).json({ 
        code: "SUCCESS",
        message: 'Bid successfully stored' });
}

export const getBidHistory = (req: Request, res: Response) => {
    try {
        const user = req.user as { userId: string }; 
        if (!user || !user.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { price, startTime, closeTime, quantity, bidId } = req.query as any;
        const bids =  marketServices.getBidsFromHistory(user.userId, bidId, price, startTime, closeTime, quantity)
        res.status(200).json({ 
            code: "SUCCESS",
            data: bids,
         });

    } catch(err) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getTotalTransactions = (req: Request, res: Response) => {
    try {
        const user = req.user as { userId: string }; 
        if (!user || !user.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const response =  marketServices.getTotalTransaction()
        res.status(200).json({ 
            code: "SUCCESS",
            data: response,
         });

    } catch(err) {
        res.status(500).json({ message: "Internal server error" });
    }
}