import { useState } from "react"
import NextImage from "next/image"
import { SessionsDTO, RsvpDTO } from "../../types"
import BaseTemplate from "../Base"

type Props = {
    session: SessionsDTO
    createRsvp: (user_id: number, session_id: number) => Promise<RsvpDTO | null>
    deleteRsvp: (id: number) => Promise<boolean>
}

const SessionPage = ({ session, createRsvp, deleteRsvp }: Props) => {
    const LOGGED_IN_USER_ID = 1

    const { startDate, endTime, location, startTime } = session
    const [rsvpId, setRsvpId] = useState(session.rsvps[0]?.id ?? 0)

    const startDateFormatted = new Date(startDate).toLocaleDateString("en-US", { day: "numeric" })
    const startWeekDayFormatted = new Date(startDate).toLocaleDateString("en-US", { weekday: "long" })
    const eventMonthFormatted = new Date(startDate).toLocaleDateString("en-US", { month: "long" })

    const onCreateRvsp = async () => {
        const newRsvp = await createRsvp(LOGGED_IN_USER_ID, session.id)
        if (newRsvp !== null) {
            console.log("Rsvp created: ", newRsvp)
            setRsvpId(newRsvp.id)
        }
    }

    const onDeleteRsvp = async () => {
        const isDeleted = await deleteRsvp(rsvpId)
        if (isDeleted) {
            console.log("Rsvp deleted")
            setRsvpId(0)
        }
    }

    return (
        <BaseTemplate>
            <div className="flex flex-col items-center bg-[#EEEEF0] h-[100vh] px-4 md:px-[24px] py-4 md:py-[24px] gap-4 md:gap-[16px]">
                <div className="flex flex-col md:flex-row justify-between p-5 bg-white w-full rounded-[8px]">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <h1 className={`text-[#1C292899]`}>Program</h1>
                        <h1 className={`text-[#1C292899]`}>/</h1>
                        <h1 className={`text-black font-[600]`}>ZK Week</h1>
                    </div>
                    <div className="flex flex-row gap-[8px] items-center">
                        <button className="flex gap-2 items-center bg-white border border-primary text-zulalu-primary font-[600] py-[8px] px-[16px] rounded-[8px]">
                            <NextImage src={"/vector-bookmark.svg"} width={12} height={16} />
                            BOOKMARK
                        </button>
                        {rsvpId === 0 && (
                            <button
                                onClick={onCreateRvsp}
                                className="bg-zulalu-primary text-white py-[8px] px-[16px] rounded-[8px] gap-[8px] flex flex-row items-center justify-center"
                            >
                                RSVP
                            </button>
                        )}
                        {rsvpId !== 0 && (
                            <button
                                onClick={() => onDeleteRsvp()}
                                className="flex gap-2 items-center bg-white border border-primary text-zulalu-primary font-[600] py-[8px] px-[16px] rounded-[8px]"
                            >
                                <NextImage src={"/vector-circle-check.svg"} width={16} height={16} />
                                SEE YOU THERE!
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-col md:flex-row gap-[8px] h-full">
                    <div className="flex flex-col items-start pt-4 md:pt-[32px] gap-2 px-4 md:px-[32px] pb-4 md:pb-[40px] bg-white rounded-[8px] w-full md:w-4/6">
                        <div className="flex flex-row items-end">
                            <p className="text-[40px] font-semibold">{session.name}</p>
                        </div>
                        <div className="flex flex-row flex-wrap items-center gap-[24px]">
                            <div className="flex gap-1 items-center justify-start mt-4">
                                <NextImage src={"/vector-calendar.svg"} alt="calendar" width={15} height={15} />
                                <h1 className="text-zulalu-secondary">{`${startWeekDayFormatted}, ${eventMonthFormatted} ${startDateFormatted}th`}</h1>
                            </div>
                            <div className="flex gap-1 items-center justify-start mt-4">
                                <NextImage src={"/vector-clock.svg"} alt="calendar" width={15} height={15} />
                                <h1 className="text-zulalu-secondary">{`${startTime} - ${endTime}`}</h1>
                            </div>
                            <div className="flex gap-1 items-center justify-start mt-4">
                                <NextImage src={"/vector-location.svg"} alt="calendar" width={15} height={15} />
                                <h1 className="text-zulalu-secondary">{location}</h1>
                            </div>
                        </div>
                        <div className="flex flex-row gap-[24px] w-full mt-4">
                            <div className="w-5/6 py-5">{session.info}</div>
                            <div className="flex flex-wrap gap-[8px] w-3/6 p-5">
                                {session.organizers &&
                                    session.organizers.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex w-auto rounded-[4px] gap-2 px-2 py-1 bg-[#E4EAEA] text-[16px]"
                                        >
                                            <NextImage src={"/user-icon-5.svg"} alt="calendar" width={24} height={24} />
                                            <p>Organizer:</p>
                                            <p className="font-bold">{item}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 py-4 md:py-[32px] px-5 w-full md:w-2/6">
                        <div className="flex flex-col gap-[8px]">
                            <h4 className="text-xl font-semibold">Tags</h4>
                            <div className="flex flex-wrap gap-5">
                                {session.tags &&
                                    session.tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="bg-[#F8FFFE] capitalize rounded-[37px] py-[4px] px-[16px] flex flex-row items-center justify-center"
                                        >
                                            {tag}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <h4 className="text-xl font-semibold">About</h4>
                            <div className="flex items-center gap-1">
                                Format: <p className="font-bold">Live</p>
                            </div>
                            <div className="flex items-center gap-1">
                                Track: <p className="font-bold">ZK</p>
                            </div>
                            <div className="flex items-center gap-1">
                                Type: <p className="font-bold">Workshop</p>
                            </div>
                            <div className="flex items-center gap-1">
                                Level: <p className="font-bold">Intermediate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseTemplate>
    )
}

export default SessionPage