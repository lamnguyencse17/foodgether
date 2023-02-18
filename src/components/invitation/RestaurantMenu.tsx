import {
  Box,
  Card,
  CardBody,
  Skeleton,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { InvitationDishTypes } from "@prisma/client";
import { isEmpty } from "radash";
import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";
import { shallow } from "zustand/shallow";
import useStore from "../../hooks/store";
import { VirtuosoRefContext } from "../../pages/invitation/[id]";
import { listifyInvitationOptions } from "../../utils/transform";
import ItemOptionModal from "./ItemOptionModal";
import RestaurantDishTypes from "./RestaurantDishTypes";

type RestaurantMenuProps = {
  dishTypes: InvitationDishTypes[];
  dishList: {
    [dishTypeId: string]: number[];
  };
};

export const CurrentOptionModalContext = createContext<{
  currentOptionModal: number | null;
  setCurrentOptionModal: (currentOptionModal: number | null) => void;
}>({ currentOptionModal: null, setCurrentOptionModal: () => undefined });

const RestaurantMenu: FunctionComponent<RestaurantMenuProps> = ({
  dishTypes,
  dishList,
}) => {
  const { dishDict, optionDict } = useStore(
    (state) => ({
      dishDict: state.dishDict.dataV2.invitationPage,
      optionDict: state.optionDict.dataV2.invitationPage,
    }),
    shallow
  );
  const [currentOptionModal, setCurrentOptionModal] = useState<null | number>(
    null
  );
  const { onOpen, onClose, isOpen } = useDisclosure();
  const virtuosoRef = useContext(VirtuosoRefContext);
  const itemRenderer = useCallback(
    (id: number, dishType: InvitationDishTypes) => (
      <RestaurantDishTypes
        dishType={dishType}
        dishTypeId={dishType.id}
        dishList={dishList}
      />
    ),
    [dishTypes.length]
  );
  const modalDish = useMemo(() => {
    if (!currentOptionModal) {
      return undefined;
    }
    return dishDict?.dishes[currentOptionModal];
  }, [currentOptionModal]);

  const modalOption = useMemo(() => {
    if (!currentOptionModal) {
      return [];
    }
    return listifyInvitationOptions(optionDict?.options[currentOptionModal]);
  }, [currentOptionModal]);

  const setCurrentOptionModalContext = (dishId: number | null) => {
    setCurrentOptionModal(dishId);
    onOpen();
  };

  const handleCloseModal = () => {
    setCurrentOptionModal(null);
    onClose();
  };
  return (
    <CurrentOptionModalContext.Provider
      value={{
        currentOptionModal,
        setCurrentOptionModal: setCurrentOptionModalContext,
      }}
    >
      <Box flex={[null, null, 1]} maxW="full" width="100%">
        {isEmpty(dishTypes) ? (
          <Skeleton height="20" />
        ) : (
          <Card width="full">
            <CardBody width="full">
              <VStack divider={<StackDivider />}>
                <Virtuoso
                  ref={virtuosoRef}
                  initialItemCount={2}
                  useWindowScroll
                  data={dishTypes}
                  style={{ width: "100%" }}
                  itemContent={itemRenderer}
                />
              </VStack>
            </CardBody>
          </Card>
        )}
      </Box>
      {modalDish && (
        <ItemOptionModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          dish={modalDish}
          options={modalOption}
          isFetching={false}
        />
      )}
    </CurrentOptionModalContext.Provider>
  );
};

export default RestaurantMenu;
