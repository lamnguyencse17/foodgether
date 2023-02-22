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
import { createContext, FunctionComponent, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import useStore from "../../hooks/store";
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

const RestaurantMenu: FunctionComponent<RestaurantMenuProps> = ({ dishTypes, dishList }) => {
  const { dishDict, optionDict } = useStore(
    (state) => ({
      dishDict: state.dishDict.dataV2.invitationPage?.dishes || {},
      optionDict: state.optionDict.dataV2.invitationPage?.options || {},
    }),
    shallow,
  );
  const [currentOptionModal, setCurrentOptionModal] = useState<null | number>(null);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const modalDish = useMemo(() => {
    if (!currentOptionModal) {
      return undefined;
    }
    return dishDict[currentOptionModal];
  }, [currentOptionModal]);

  const modalOption = useMemo(() => {
    if (!currentOptionModal) {
      return [];
    }
    return listifyInvitationOptions(optionDict[currentOptionModal]);
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
                {dishTypes.map((dishType) => (
                  <RestaurantDishTypes
                    dishType={dishType}
                    dishTypeId={dishType.id}
                    dishList={dishList}
                    key={dishType.id}
                  />
                ))}
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
