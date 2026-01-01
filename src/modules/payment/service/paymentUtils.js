import crypto from "node:crypto";

export function generateOrderId(registrationId){
   const orderId = `ORD_${Date.now()}_${registrationId}`

   return orderId;
}


export function generateQr() {
  return crypto.randomUUID();
}
