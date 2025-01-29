import { HttpContextToken } from "@angular/common/http";
export const WITH_TOKEN = new HttpContextToken<boolean>(() => true);