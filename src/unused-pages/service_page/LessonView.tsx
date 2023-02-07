import React from "react"
import { observer } from "mobx-react"
import { useState, useEffect } from "react";

import { useTendonContainer } from "linkWithBackend/services/container";
import LessonDataViewModel from "./LessonViewModel";
import TYPES, { Lesson } from "linkWithBackend/interfaces/TendonType";
import CourseNode from "@components/courseMap/LessonNode";
import { StatusType } from "@customTypes/index";
import { useRouter } from "next/router";
import container from "linkWithBackend/services/inversify.config";
import MemoryService from "linkWithBackend/services/memory_services";

interface propsInterface {
    body: Lesson
}

interface realLessonInterface {
    lesson_id: string
}

var memService = container.get<MemoryService>(TYPES.MemoryService)
var token = memService.getLocalStorage("token")

export const LessonCreateHandle = observer((props: propsInterface) => {
    const body = props.body
    const [lessonView, setLessonView] = useState<Lesson>({} as Lesson)
    const [message, setMessage] = useState<String>("")
    const [status, setStatus] = useState<Number>(0)
    const viewModel = new LessonDataViewModel(useTendonContainer())

    new Promise(function (myResolve, myReject) {
        useEffect(() => {
            const tmpValue = viewModel.createLesson(body, token)
            myResolve(tmpValue)
        }, [])
    }).then(() => {
        setLessonView(viewModel.getLesson())
        setMessage(viewModel.getMessage())
        setStatus(viewModel.getStatus())
    })

    if (status === 201) {
        return (
            <div>
                <p> [ Lesson POST ] </p>
                <LessonView viewModel={lessonView} />
            </div>
        )
    } else {
        if (message === "") {
            return (
                <div> Loading... </div>
            )
        }
        return (
            <div>
                <p> Lesson POST ERROR ZONE: </p>
                <p> {message} </p>
            </div>
        )
    }
})

export const LessonGetHandle = observer((props: realLessonInterface) => {
    const router = useRouter()
    const lesson_id = props.lesson_id
    const [lessonView, setLessonView] = useState<Lesson>({} as Lesson)
    const [message, setMessage] = useState<String>("")
    const [status, setStatus] = useState<Number>(0)
    const viewModel = new LessonDataViewModel(useTendonContainer())
    new Promise(function (myResolve, myReject) {
        useEffect(() => {
            var mytoken = memService.getLocalStorage("token")
            const tmpValue = viewModel.getLessonData(lesson_id, mytoken)
            myResolve(tmpValue)
        }, [])
    }).then(() => {
        setLessonView(viewModel.getLesson())
        setMessage(viewModel.getMessage())
        setStatus(viewModel.getStatus())
    })

    if (lessonView.id === undefined) {
        if (message === "") {
            return (
                <div> Loading... </div>
            )
        }
        if (status === 409) {
            router.push("/login")
            return (
                <div> Expired Time YOU MUST LOGIN! </div>
            )
        }
        return (
            <div>
                <p>  LESSON GET ERROR ZONE: </p>
                <p> {message} </p>
            </div>
        )
    }

    return (
        <div>
            <CourseNode
                key={lessonView.id}
                lessonId={lessonView.id}
                lessonName={lessonView.name}
                status={StatusType.COMPLETED}
                setChildReady={() => { }}
                isRender={true}
            />
        </div>
    )
})

export const LessonUpdateHandle = observer((props: propsInterface) => {
    const body = props.body
    const lesson_id = props.body.id!
    const [lessonView, setLessonView] = useState<Lesson>({} as Lesson)
    const [message, setMessage] = useState<String>("")
    const viewModel = new LessonDataViewModel(useTendonContainer())
    new Promise(function (myResolve, myReject) {
        useEffect(() => {
            const tmpValue = viewModel.updateLessonData(lesson_id, token, body)
            myResolve(tmpValue)
        }, [])
    }).then(() => {
        setLessonView(viewModel.getLesson())
        setMessage(viewModel.getMessage())
    })

    if (lessonView.id === undefined) {
        if (message === "") {
            return (
                <div> Loading... </div>
            )
        }
        return (
            <div>
                <p> LESSON UPDATE ERROR ZONE: </p>
                <p> {message} </p>
            </div>
        )
    }

    return (
        <div>
            <p> [ LESSON UPDATE ] </p>
            <LessonView viewModel={lessonView} />
        </div>
    )
})

export const LessonDeleteHandle = observer((props: propsInterface) => {
    const lesson_id = props.body.id!
    const [deleteStatus, setDeleteStatus] = useState<Number>(0)
    const [message, setMessage] = useState<String>("")
    const viewModel = new LessonDataViewModel(useTendonContainer())

    new Promise(function (myResolve, myReject) {
        useEffect(() => {
            const tmpValue = viewModel.deleteLesson(lesson_id, token)
            myResolve(tmpValue)
        }, [])
    }).then(() => {
        setDeleteStatus(viewModel.getStatus())
        setMessage(viewModel.getMessage())
    })

    if (deleteStatus === 200) {
        return (
            <div>
                <p> [ LESSON DELETE ] </p>
                <p> Delete Complete </p>
            </div>
        )
    } else {
        if (message === "") {
            return (
                <div> Loading... </div>
            )
        }
        return (
            <div>
                <p> LESSON DELETE ERROR ZONE:  </p>
                <p> {message} </p>
            </div>
        )
    }
})

interface ShowDataViewProps {
    viewModel: Lesson
}

const LessonView = observer(({ viewModel }: ShowDataViewProps) => {
    return (
        <div>
            <div key={viewModel.id}>
                <p> #### {viewModel.id} #### </p>
                <li> name: {viewModel.name} </li>
                <li> description: {viewModel.description} </li>
                <br></br>
                <li> nodes:
                    {viewModel.nodes.map((data: string) => (
                        <div key={data}>
                            <p> {data} </p>
                        </div>
                    ))}
                </li>
                <br></br>
                <li> prevLesson:
                    {viewModel.prevLesson.map((data: string) => (
                        <div key={data}>
                            <p> {data} </p>
                        </div>
                    ))}
                </li>
                <br></br>
                <li> nextLesson:
                    {viewModel.nextLesson.map((data: string) => (
                        <div key={data}>
                            <p> {data} </p>
                        </div>
                    ))}
                </li>
            </div>
        </div>
    )
})