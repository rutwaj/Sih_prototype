/**
 * data/contacts.ts
 * Mock village contacts per region.
 * These are fictional names used purely for the demo.
 */

export type ContactRole = "sarpanch" | "school" | "health_centre" | "police";

export interface Contact {
  id: string;
  name: string;
  role: ContactRole;
  region: "Uttarakhand" | "Assam" | "Kerala";
  village: string;
  phone: string;   // fake number
  whatsapp: string;
}

export type DeliveryState = "pending" | "sent" | "delivered" | "failed";

export interface MessageLog {
  contactId: string;
  channel: "call" | "whatsapp" | "sms";
  state: DeliveryState;
  sentAt: string;
  deliveredAt?: string;
}

export const CONTACTS: Contact[] = [
  // Uttarakhand
  {
    id: "UT-C1",
    name: "Ramesh Tiwari",
    role: "sarpanch",
    region: "Uttarakhand",
    village: "Bhowali",
    phone: "+91-94120-11234",
    whatsapp: "+91-94120-11234",
  },
  {
    id: "UT-C2",
    name: "Nainital Government School",
    role: "school",
    region: "Uttarakhand",
    village: "Nainital",
    phone: "+91-05942-235678",
    whatsapp: "+91-94110-22345",
  },
  {
    id: "UT-C3",
    name: "Bhowali CHC",
    role: "health_centre",
    region: "Uttarakhand",
    village: "Bhowali",
    phone: "+91-05942-230456",
    whatsapp: "+91-94110-33456",
  },

  // Assam
  {
    id: "AS-C1",
    name: "Dipak Bora",
    role: "sarpanch",
    region: "Assam",
    village: "Morigaon",
    phone: "+91-98640-44567",
    whatsapp: "+91-98640-44567",
  },
  {
    id: "AS-C2",
    name: "Morigaon Model School",
    role: "school",
    region: "Assam",
    village: "Morigaon",
    phone: "+91-03678-223456",
    whatsapp: "+91-98540-55678",
  },
  {
    id: "AS-C3",
    name: "Morigaon District Hospital",
    role: "health_centre",
    region: "Assam",
    village: "Morigaon",
    phone: "+91-03678-224567",
    whatsapp: "+91-98540-66789",
  },

  // Kerala
  {
    id: "KL-C1",
    name: "Latha Menon",
    role: "sarpanch",
    region: "Kerala",
    village: "Kalpetta",
    phone: "+91-94470-77890",
    whatsapp: "+91-94470-77890",
  },
  {
    id: "KL-C2",
    name: "Kalpetta GHSS",
    role: "school",
    region: "Kerala",
    village: "Kalpetta",
    phone: "+91-04936-202345",
    whatsapp: "+91-94460-88901",
  },
  {
    id: "KL-C3",
    name: "Kalpetta General Hospital",
    role: "health_centre",
    region: "Kerala",
    village: "Kalpetta",
    phone: "+91-04936-203456",
    whatsapp: "+91-94460-99012",
  },
];

/** Get contacts for a given region */
export function getContactsByRegion(
  region: "Uttarakhand" | "Assam" | "Kerala"
): Contact[] {
  return CONTACTS.filter((c) => c.region === region);
}
