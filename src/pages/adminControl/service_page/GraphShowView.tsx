import CourseNode from "@components/curriculaMap/LearningNode";
import { Course, Lesson } from "linkWithBackend/interfaces/TendonType";
import React, { useEffect, useState } from "react";
import { StatusType } from "@customTypes/index";
import TopologicalSort from "./GraphTopoHandle";
import LessonDataViewModel from "./LessonViewModel";
import { useTendonContainer } from "linkWithBackend/services/container";
import { token } from "../_demo_setting";
import LessonGraphService from "linkWithBackend/services/data_service";
import { LessonGetHandle } from "./LessonView";

interface graphProps {
    courseView: Course
}

async function getLessonInformation(lesson_id: string) {
    var result: Lesson = {} as Lesson
    var lessonGraph = new LessonGraphService()
    var lessonInformation:Lesson = await lessonGraph.getLessonById(lesson_id, token)
    // console.log("-->", lessonInformation?.name)
    result = {
        ... result,
        id: lessonInformation?.id,
        name: lessonInformation?.name,
        description: lessonInformation?.description,
        access: lessonInformation?.access,
        nodes: lessonInformation?.nodes,
        nextLesson: lessonInformation?.nextLesson,
        prevLesson: lessonInformation?.prevLesson
    }
    return result
}

export default function GraphPathView({ courseView } : graphProps) {
    const lessonArray = courseView.lessons
    var lessonTopoArray: string[] = []
    var data: Lesson[] = []
    for (let i = 0; i < lessonArray.length; i++) {
        let promise = new Promise<Lesson>((resolve, reject) => {
            const tmpValue = getLessonInformation(lessonArray[i]!)
            resolve(tmpValue)
        })
        promise.then( value => {
            data.push(value)
            console.log(data)
        }).then( value => {
            if (data.length === lessonArray.length) {
                lessonTopoArray = TopologicalSort(data)
                console.log(lessonTopoArray)
            }
        })
    }
    console.log("Topo: ", lessonTopoArray)

    return (
        <>
            <CourseNode
                // renderId={startCourseNode.courseId} // Types require this, but it's not used
                key={courseView.id}
                lessonId={courseView.id}
                lessonName={courseView.name}
                status= {StatusType.COMPLETED}
                setChildReady={() => { }} // No Child will use this one so it's fine
                isRender={true}
            />
            {lessonArray.map((lesson_id: string, index: number) => (
                <div key= {index}>
                    <LessonGetHandle lesson_id={lesson_id} />
                </div>
            ))}

        </>
    )
}