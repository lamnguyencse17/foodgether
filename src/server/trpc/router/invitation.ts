import { createInvitation } from "../../handlers/invitation";
import { router } from "../trpc";

const invitationRouter = router({
  createInvitation,
});

export default invitationRouter;
