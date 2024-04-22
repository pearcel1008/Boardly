import React, { useState, useEffect } from 'react';
import { VStack, Text, Divider, Link, Box, HStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, StackDivider, Icon, Textarea, Flex, Select, Card,
        Drawer,
        DrawerBody,
        DrawerFooter,
        DrawerHeader,
        DrawerOverlay,
        DrawerContent,
        DrawerCloseButton,
        IconButton,
        CardFooter
    } from '@chakra-ui/react';
import { CloseIcon, EditIcon, CheckIcon, ChatIcon } from '@chakra-ui/icons';


export const Cards = ({ myCardList, description }) => {
    // Access myObject here
    console.log(myCardList);
    const [displayCards, setDisplayCards] = useState([]);
    const [editingCardId, setEditingCardId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [dejargonSuggestion, setDejargonSuggestion] = useState('');
    const [taskDuration, setTaskDuration] = useState('');
    const [showDejargonText, setShowDejargonText] = useState(false);
    const [showSuggestionText, setShowSuggestionText] = useState(false);
    const { isOpen: isChatGPTOpen, onOpen: onChatGPTOpen, onClose:onChatGPTClose } = useDisclosure()
    const [openCardId, setOpenCardId] = useState(null); // State to track which card modal is open

    const btnRef = React.useRef()

    useEffect(() => {
        handleShowCards(); // Fetch data when component mounts
    }, []);

    const handleShowCards = async () => {
        var parts = myCardList.split('_');
        const ID = parts[1];
        try {
            const boardData = await fetch(`http://localhost:8000/boardly/card/get/cardlists?cardlist_id=${ID}`);
            if (!boardData.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await boardData.json();
            console.log(data);
  
            setDisplayCards(data);
        } catch (error) {
            console.error('Error showing cardlist:', error);
        }
    };

    const handleDeleteCard = async (cardID) => {
        // need to figure out how to get cardID from the card
        // console.log(cardID);
        var parts = cardID.split('_');
        cardID = parts[1];
        try {
            const response = await fetch(`http://localhost:8000/boardly/card/delete?id=${cardID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Card deleted successfully:', data);
            handleShowCards(); // Refresh cards after deletion
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const handleEditTitle = async (cardID, newTitle) => {
        var fieldName = 'title';
        try {
            const response = await fetch(`http://localhost:8000/boardly/card/update/field?card_id=${cardID}&field_name=${fieldName}&new_value=${newTitle}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Card title updated successfully:', data);
            handleShowCards(); // Refresh cards after updating title
            setEditingCardId(null); // Exit edit mode
            setEditingTitle(''); // Reset editing title
        } catch (error) {
            console.error('Error updating card title:', error);
        }
    
    };

    const handleEditDescription = async (cardID, newDescription) => {
        var fieldName = 'description';
        try {
            const response = await fetch(`http://localhost:8000/boardly/card/update/field?card_id=${cardID}&field_name=${fieldName}&new_value=${newDescription}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: newDescription }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Card title updated successfully:', data);
            handleShowCards(); // Refresh cards after updating title            
        } catch (error) {
            console.error('Error updating card title:', error);
        }
    
    };
    
    const fetchDejargon = async (description) => {
        try {
          const response = await fetch(`http://localhost:8000/boardly/openapi/dejargon?description=${description}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch title suggestions');
          }
      
          const data = await response.json();
          setDejargonSuggestion(data);
        } catch (error) {
          throw error;
        }
      };

      const fetchTitleSuggestions = async (cardTitle) => {
        try {
          const response = await fetch(`http://localhost:8000/boardly/openapi/title?description=${cardTitle}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch title suggestions');
          }
      
          const data = await response.json();
          const arrayOfTitles = data.split(/\d\. /).filter(Boolean);
          setTitleSuggestions(arrayOfTitles);
          setShowSuggestionText(true); //show the suggestions on gpt
          
        } catch (error) {
          throw error;
        }
      };

      const fetchTaskDurations = async (cardTitle) => {
        try {
          const response = await fetch(`http://localhost:8000/boardly/openapi/duration?description=${cardTitle}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to fetch title suggestions');
          }
          
          const data = await response.json();
          setTaskDuration(data);
        } catch (error) {
          throw error;
        }
      };
     
    const closingChatGPT = () => {
        setShowSuggestionText(false);
        setShowDejargonText(false);
        setDejargonSuggestion(""); // Clearing dejargonSuggestion value
        setTitleSuggestions([]); // Clearing titleSuggestions array
    };
    return (
        <div>
            {/* Render cards within the card list */}
            {displayCards.map((card, cardIndex) => (
             <Flex key={cardIndex} justifyContent="center" alignItems="center" mt={3}>
                <Box mb={4} className="card" minW="200px" whiteSpace="normal" p={6} bg="white" borderRadius="md" _hover={{ boxShadow: '0 0 0 2px purple', cursor: 'pointer', }} onClick={() => {
                    fetchTaskDurations(card.title)
                    setOpenCardId(card.id)
                }}>
                    {/* CARD MODAL */}
                    <Modal onClose={() =>{setOpenCardId(null)}} size="xl" isOpen={openCardId === card.id}>
                        <ModalOverlay bg='none' backdropFilter='auto' backdropBlur='10px' />
                        <ModalContent width="1000px" height="500px">
                            <ModalHeader>
                            <Flex alignItems="center" mt={4}>
                                {editingCardId !== card.id ? (
                                        <>
                                            <Text fontSize={'xl'} color={'black'} mr={4}>{card.title}</Text>
                                            <Icon as={EditIcon} w={3} h={3} color={'gray'} _hover={{color: 'green', transform: 'scale(1.2)'}}
                                                onClick={() => { setEditingCardId(card.id); setEditingTitle(card.title); }} />
                                        </>
                                    ) : (
                                        <>
                                            <Input
                                                value={editingTitle}
                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                size="sm"
                                                autoFocus
                                                onBlur={() => handleEditTitle(card.id, editingTitle)}
                                                onKeyDown={(e) => { if(e.key === 'Enter') { handleEditTitle(card.id, editingTitle); }}}
                                            />
                                            <Icon ml={4} as={CheckIcon} w={3} h={3} color={'green'} _hover={{color: 'blue', transform: 'scale(1.2)'}}
                                                onClick={() => handleEditTitle(card.id, editingTitle)} />
                                        </>
                                    )}
                            </Flex>
                            <Flex justifyContent={"flex-end"}>
                                {/* CHATGPT FUNCTION */}
                                <Icon className="cursor-pointer" as={ChatIcon} ref={btnRef} color='purple' onClick={onChatGPTOpen}/>
                                <Text fontSize="sm" ml={2}>AI Enchancement</Text>
                                </Flex>
                            </ModalHeader>
                            <Drawer
                                isOpen={isChatGPTOpen}
                                placement='right'
                                onClose={onChatGPTClose}
                                finalFocusRef={btnRef}
                            >
                            <DrawerOverlay />
                            <DrawerContent>
                            <DrawerCloseButton onClick={() => { setShowSuggestionText(false); closingChatGPT() }}/>
                            <DrawerHeader>ChatGPT Suggestions</DrawerHeader>
                            <DrawerBody>
                                <Flex>
                                    <Button mr={4} onClick={() => { fetchDejargon(card.description); setShowDejargonText(true); }}>Dejargon</Button>
                                    <Button mr={4} onClick={() => { fetchTitleSuggestions(card.title); setShowSuggestionText(true); }}>Suggest a title</Button>
                                </Flex>
                                {showDejargonText && (
                                <>
                                <Text>Here is what the description is trying to say: </Text>
                                    <Text fontWeight="bold">{dejargonSuggestion}</Text>
                                </>
                                )}
                                {showSuggestionText && (
                                <>
                                <Text>Here are some title suggestions that could replace the current title. Please select the best option for you.</Text>
                                <Box>
                                    {titleSuggestions.map((title, index) => (
                                        <Button key={index} style={{ display: 'inline-flex', margin: '5px' }} onClick={() => { setEditingTitle(title); handleEditTitle(card.id, title); onChatGPTClose(); closingChatGPT() }}>
                                            {title}
                                        </Button>
                                    ))}
                                </Box>
                                </>
                            )}
                            </DrawerBody>
                            <DrawerFooter>
                                <Button variant='outline' mr={3} onClick={() => {onChatGPTClose(); closingChatGPT() }}>
                                Cancel
                                </Button>
                            </DrawerFooter>
                            </DrawerContent>
                            </Drawer>
                            {/* END OF CHATGPT FUNCTION */}
                        <ModalCloseButton />
                        <ModalBody>
                            <Text color={"darkgray"} fontSize="lg">Description</Text>
                            {card.description}
                            <Text color={"darkgray"} mt={8}>This task normally takes about {taskDuration} </Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => {setOpenCardId(null)}}>Close</Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {/* END OF CARD MODAL */}

                    <Flex direction="column" position="relative">
                        <Icon as={CloseIcon} w={3} h={3} color={'gray'} position="absolute" right={-4} top={-4} _hover={{color: 'red', transform: 'scale(1.2)'}} onClick={()=>handleDeleteCard(card.id)} />
                        {/* Flex container for the title, edit icon */}
                        <Flex direction="column" alignItems="center">
                            <Flex direction="row" alignItems="center">
                                <Text fontWeight="bold" color={'black'}>{card.title}</Text>
                            </Flex>
                        </Flex>                       
                    </Flex>
                </Box>
            </Flex>
            ))}
        </div>
    );
};

export default Cards;
