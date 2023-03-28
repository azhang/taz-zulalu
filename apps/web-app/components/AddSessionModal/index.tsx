import { Dialog, Transition } from "@headlessui/react"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/router"
import { Fragment, useRef, useState } from "react"
import axios from "axios"

import ModalSteps from "./ModalSteps"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import { EventsDTO, SessionsDTO } from "../../types"

type NewSessionState = {
    description: string
    equipment: string
    event_id: number
    event_type: string
    format: string
    hasTicket: boolean
    info: string
    level: string
    location: string
    name: string
    duration: string
    startDate: Date
    startTime: string
    tags: string[]
    team_members: {
        name: string
        role: string
    }[]
    track: string
    event_slug: string
    event_item_id: number
}

type Props = {
    isOpen: boolean
    closeModal: (b: boolean) => void
    event: EventsDTO
    sessions: SessionsDTO[]
}

const AddSessionModal = ({ isOpen, closeModal, event, sessions }: Props) => {
    const router = useRouter()
    const questionTextRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [steps, setSteps] = useState(1)
    const [newSession, setNewSession] = useState<NewSessionState>({
        name: "",
        team_members: [],
        startDate: new Date(),
        startTime: "00",
        location: "",
        tags: [],
        info: "",
        event_id: event.id,
        duration: "0",
        hasTicket: false,
        format: "Live",
        level: "Beginner",
        equipment: "",
        description: "",
        track: "ZK Week",
        event_type: "Workshop",
        event_slug: event.slug,
        event_item_id: event.item_id
    })
    const [amountTickets, setAmountTickets] = useState("0")
    console.log("evvvent", event)
    const handleSubmit = async () => {
        setIsLoading(true)
        const formattedTime = `${newSession.startTime}:00`

        try {
            if (newSession.hasTicket) {
                // Step 1 Create SubEvent

                const subEventRes = await axios.post(`/api/pretix-create-subevent`, {
                    name: newSession.name,
                    startDate: newSession.startDate,
                    endDate: newSession.startDate,
                    slug: event.slug,
                    itemId: event.item_id
                })

                console.log("Created subEvent response: ", subEventRes.data)

                // // Step 3 Create Quota for the subEvent

                const quotaCreatedRes = await axios.post(`/api/pretix-create-quota/`, {
                    ticketAmount: amountTickets,
                    subEventId: subEventRes.data.id,
                    slug: event.slug,
                    itemId: event.item_id
                })

                console.log("Quota creatd: ", quotaCreatedRes.data)
                // Step 5 Add to database
                const createEventDB = await axios.post("/api/createSession", {
                    ...newSession,
                    subEventId: subEventRes.data.id,
                    startTime: formattedTime,
                    quota_id: quotaCreatedRes.data.id
                })
                console.log("DB response: ", createEventDB)
            } else {
                const createEventDB = await axios.post("/api/createSession", {
                    ...newSession,
                    startTime: formattedTime
                })
                console.log("DB response: ", createEventDB)
            }
        } catch (error) {
            toast.error("Failed to create an event", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            })
        }

        // refresh to see new event created
        router.push(router.asPath)

        // CLEAN EVERYTHING AFTER CREATING EVENT

        setIsLoading(false)
        setSteps(1)
        setNewSession({
            name: "",
            team_members: [],
            startDate: new Date(),
            location: "",
            startTime: "00",
            tags: [],
            info: "",
            event_id: event.id,
            event_item_id: event.item_id,
            event_slug: event.slug,
            duration: "0",
            description: "",
            hasTicket: false,
            track: "ZK Week",
            equipment: "",
            format: "Live",
            event_type: "Workshop",
            level: "Beginner"
        })
        closeModal(false)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" initialFocus={questionTextRef} className="relative z-40 " onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 h-full ">
                    <div className="flex h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="flex flex-col h-full w-5/6 overflow-y-scroll max-w-full transform rounded-lg bg-white text-left align-middle  transition-all">
                                <div className="w-full h-full py-5 px-10">
                                    <div className="flex w-full justify-between items-center">
                                        <h1 className="text-[24px] font-[600]">
                                            {steps === 1
                                                ? "Session Logistics (for organizers)"
                                                : steps === 2
                                                ? "Session info (shared with the Zuzalu team)"
                                                : "Review Session"}
                                        </h1>
                                        <div
                                            onClick={() => closeModal(false)}
                                            className="cursor-pointer flex items-center border-2 border-black justify-center w-[25px] h-[25px] rounded-full"
                                        >
                                            X
                                        </div>
                                    </div>
                                    <ModalSteps steps={steps} />
                                    {steps === 1 && (
                                        <Step1
                                            newSession={newSession}
                                            setNewSession={setNewSession}
                                            setSteps={setSteps}
                                            sessions={sessions}
                                        />
                                    )}

                                    {steps === 2 && (
                                        <Step2
                                            setSteps={setSteps}
                                            setAmountTickets={setAmountTickets}
                                            amountTickets={amountTickets}
                                            newSession={newSession}
                                            setNewSession={setNewSession}
                                        />
                                    )}

                                    {steps === 3 && (
                                        <Step3
                                            setSteps={setSteps}
                                            newSession={newSession}
                                            handleSubmit={handleSubmit}
                                            isLoading={isLoading}
                                            amountTickets={amountTickets}
                                        />
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default AddSessionModal
