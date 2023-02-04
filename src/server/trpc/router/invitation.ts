import { createNewInvitation } from "../../handlers/invitation";
import { router } from "../trpc";

const invitationRouter = router({
  createNewInvitation,
});

export default invitationRouter;
