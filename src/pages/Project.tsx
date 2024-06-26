import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useParams } from "react-router-dom";
import { ThemeIcon } from '../assets/icons';
import monica from "../assets/monic.jpg";
import Button from '../components/Button/Button';
import Container from '../components/Container/Container';
import Dots from '../components/Dots/Dots';
import Item from '../components/Item/Item';
import "./Project.css";

const isImgBg = (img: string) => ({
  background: `url(${img})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center"
})

export type ItemProps = {
  key?: React.Key | null | undefined,
  id: string,
  content: string,
  tags?: string[],
  setContainers?: React.Dispatch<any>
}

export type ContainerMapProps = {
  [key: string]: ItemProps[]
}

export type ContainerProps = {
  key?: React.Key | null | undefined;
  id: string,
  title: string,
  list: ItemProps[],
  setContainers?: React.Dispatch<any>
}

type ActiveProps = (Omit<ItemProps, 'setContainers' | 'key'> | Omit<ContainerProps, 'setContainers' | 'key'>);

const Project: React.FC = () => {
  const params = useParams();
  const { setNodeRef } = useDroppable({ id: "container-list" });
  const [containers, setContainers] = useState<ContainerMapProps>({
    Planned: [{ id: "1", content: "ffooso", tags: ["bug", "info", "inspire", "danger", "frog"] }, { id: "2", content: "ffooso1" }, { id: "3", content: "ffasooso" }],
    InProgress: [{ id: "4", content: "ffooso2", tags: ["bug", "info"] }, { id: "5", content: "ff2eeooso" }, { id: "6", content: "fsdssfooso" }],
    Completed: [{ id: "7", content: "ffoosoef32q", tags: ["info", "inspire"] }, { id: "8", content: "ffoosofsdf3" }, { id: "9", content: "fdfosadoso" }],
    Dropped: []
  })

  const [activeItem, setActiveItem] = useState<ActiveProps | null>(null)
  // const [modalOpen, setModalOpen] = useState<boolean>(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findContainer = (id: string) => {
    if (id in containers) {
      return id;
    }

    return Object.keys(containers).find(key => containers[key].find((item: any) => item && item.id === id))
  }

  const handleDragStart = ({ active }: any) => {
    const { id, data: { current: { sortable: { containerId, index } } } } = active;
    if (containerId === "container-list") {
      setActiveItem({ id, title: id, list: containers[id] })
    } else {
      setActiveItem({ ...containers[containerId][index] })
    }
  }

  const handleDragOver = (event: any) => {
    const { active, over } = event;

    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over?.id)

    if (active.data.current.sortable.containerId === "container-list") return;

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setContainers((prev: any) => {
      const overItems = prev[activeContainer];
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index;
      let newIndex;

      if (overContainer in prev) {
        newIndex = overItems.length + 1;
      } else {
        newIndex = overIndex >= 0 ? overIndex + 1 : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter((item: any) => item.id !== active.id)],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          containers[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      }
    })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer || (activeContainer !== overContainer && active.data.current.sortable.containerId !== "container-list")) {
      return
    }

    if (id !== overId) {
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index;

      setContainers((items: any) => {
        if (active.data.current.sortable.containerId === "container-list") {
          const formattedObject = Object.entries(items)

          const activeItem = formattedObject.find(item => item[0] === active.id)
          const overItem = formattedObject.find(item => item[0] === over.id || item[0] === overContainer)

          if (!activeItem || !overItem) return items;

          const newActiveIndex = formattedObject.indexOf(activeItem);
          const newOverIndex = formattedObject.indexOf(overItem);

          return Object.fromEntries(arrayMove(formattedObject, newActiveIndex, newOverIndex))
        }
        return ({
          ...items,
          [activeContainer]: arrayMove(items[activeContainer], activeIndex, overIndex)
        })
      })
    }
    setActiveItem(null);
  }

  const handleNewContainer = () => {
    if (Object.keys(containers).length > 8) {
      console.log("no more slots left")
      return;
    }
    setContainers((prev: any) => ({
      ...prev,
      ["A" + Math.floor(Math.random() * 100000001)]: []
    }))
    console.log("created new container")
  }

  return (
    <div className="project-container" style={isImgBg(monica)}>
      <div className="project-header">
        <div className='project-title'>project: {params.id}</div>
        <div className='project-options'>
          <div className='project-option button' style={isImgBg(monica)}><ThemeIcon color='white' size={20} /></div>
          <div><Dots className={["button", "project-option"]} vertical color="black" /></div>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          id='container-list'
          items={Object.keys(containers)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="project-body" ref={setNodeRef}>

            {Object.entries(containers).map(([key, value]: any) => (
              <Container key={key} id={key} title={key} list={value} setContainers={setContainers} />
            ))}
            <Button title='add container' style={{ minWidth: 280, backgroundColor: "rgb(123 124 125 / 59%)" }} onClick={handleNewContainer}></Button>
          </div>
        </SortableContext>
        <DragOverlay>{
          activeItem ?
            ('list' in activeItem) ? <Container key={activeItem.id} id={activeItem.id} title={activeItem.id} list={activeItem.list} /> :
              ('content' in activeItem) ? <Item key={activeItem.id} {...activeItem} /> : "" : ""
        }</DragOverlay>
      </DndContext>
    </div >
  )
}

export default Project