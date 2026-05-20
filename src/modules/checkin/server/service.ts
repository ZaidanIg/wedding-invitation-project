import { checkinRepository } from "./repository";
import { checkinSchema, type CheckinInput } from "./validators";

export const checkinService = {
  async checkinGuest(payload: CheckinInput) {
    const validated = checkinSchema.parse(payload);
    
    return checkinRepository.processCheckin(
      validated.guestId,
      validated.projectId,
      validated.actualAttendees
    );
  }
};
