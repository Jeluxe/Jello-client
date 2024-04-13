import { arrayMove } from "@dnd-kit/sortable";
import { createContext, useContext, useState } from "react";
import { ActiveProps, ContainerMapProps, ItemProps } from "../types/global";


export const ProjectContext = createContext<any>(null);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projectData, setProjectData] = useState<ContainerMapProps>({
    Planned: [{ id: "1", title: "Mofus", content: "ffooso", tags: ["bug", "info", "inspire", "danger", "frog"] }, { id: "2", title: "Yofus", content: "ffooso1" }, { id: "3", title: "Bofus", content: "ffasooso" }],
    InProgress: [{ id: "4", title: "Rofus", content: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis assumenda commodi sunt animi praesentium tempora est inventore eveniet nostrum incidunt. Quasi minus voluptas ea quo! Iste, tempora omnis. At, eaque.", tags: ["bug", "info"] }, { id: "5", title: "Gofus", content: "ff2eeooso" }, { id: "6", title: "Nofus", content: "fsdssfooso" }],
    Completed: [{ id: "7", title: "Dofus", content: "ffoosoef32q", tags: ["info", "inspire"], participants: [{ id: "432t7gyf7wsef", username: "froooste", avatar: null }, { id: "432t7g7345wsef", username: "groooste11", avatar: null }, { id: "432t7g7345wsef1", username: "aroooste11", avatar: null }] }, { id: "8", title: "Jofus", content: "ffoosofsdf3" }, { id: "9", title: "Aofus", content: "fdfosadoso" }],
    Dropped: []
  });

  const [activeItem, setActiveItem] = useState<ActiveProps | null>(null);


  const getNewId = (list: any[]): number => {
    let totalLength: number = 0;

    Object.values(list).forEach(item => {
      totalLength += item.length;
    })
    console.log(totalLength)
    return totalLength + 1;
  }

  const addContainer = () => {
    if (Object.keys(projectData).length > 8) {
      console.log("no more slots left");
      return;
    }
    setProjectData((prev: any) => ({
      ...prev,
      ["A" + Math.floor(Math.random() * 100000001)]: []
    }));
    console.log("created new container");
  }

  const addItem = (e: any) => {
    const selectedContainer = e.target.closest(".container").getAttribute("id");

    setProjectData((prev: any) => {
      if (selectedContainer) {
        if (prev[selectedContainer].length === 20) {
          return prev;
        }
        return {
          ...prev,
          [selectedContainer]: [
            ...prev[selectedContainer],
            { id: getNewId(prev), content: "foos" }
          ]
        }
      } else {
        return prev;
      }
    })
  }

  const addTags = (e: any, id: string) => {
    const selectedContainer = e.target.closest(".container").getAttribute("id");

    if (!selectedContainer) return;

    const newTag = "danger";

    setProjectData((prev: any) => ({
      ...prev,
      [selectedContainer]: [...prev[selectedContainer].map((item: any) => {
        if (item.id === id) {
          if (item?.tags?.includes(newTag)) return item;
          return {
            ...item,
            tags: (item?.tags) ? [...item.tags, newTag] : [newTag]
          }
        }
        return item;
      })]
    }))
  }

  const UpdateContainer = () => { }

  const UpdateItem = () => { }

  const UpdateTag = () => { }

  const removeContainer = () => { }

  const removeItem = () => { }

  const removeTag = () => { }

  const findContainer = (id: string) => {
    if (id in projectData) {
      return id;
    }

    return Object.keys(projectData).find(key => projectData[key].find((item: any) => item && item.id === id));
  }

  const handleDragStart = ({ active }: any) => {
    const { id, data: { current: { sortable: { containerId, index } } } } = active;
    if (containerId === "container-list") {
      setActiveItem({ id, title: id, list: projectData[id] });
    } else {
      setActiveItem({ ...projectData[containerId][index] });
    }
  }

  const handleDragOver = (event: any) => {
    const { active, over } = event;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over?.id);

    if (active.data.current.sortable.containerId === "container-list") return;

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setProjectData((prev: any) => {
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
          projectData[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      }
    });
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || (activeContainer !== overContainer && active.data.current.sortable.containerId !== "container-list")) {
      return;
    }

    if (id !== overId) {
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index;

      setProjectData((items: any) => {
        if (active.data.current.sortable.containerId === "container-list") {
          const formattedObject = Object.entries(items);

          const activeItem = formattedObject.find(item => item[0] === active.id);
          const overItem = formattedObject.find(item => item[0] === over.id || item[0] === overContainer);

          if (!activeItem || !overItem) return items;

          const newActiveIndex = formattedObject.indexOf(activeItem);
          const newOverIndex = formattedObject.indexOf(overItem);

          return Object.fromEntries(arrayMove(formattedObject, newActiveIndex, newOverIndex));
        }
        return ({
          ...items,
          [activeContainer]: arrayMove(items[activeContainer], activeIndex, overIndex)
        });
      });
    }
    setActiveItem(null);
  }

  const findItemById = (id: string): ItemProps | null => {
    for (const category in projectData) {
      const categoryData = projectData[category];
      for (const item of categoryData) {
        if (item.id === id) {
          return {
            ...item
          };
        }
      }
    }
    return null;
  }

  return (
    <ProjectContext.Provider value={{
      projectData,
      activeItem,
      addContainer,
      addItem,
      addTags,
      UpdateContainer,
      UpdateItem,
      UpdateTag,
      removeContainer,
      removeItem,
      removeTag,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
      findItemById
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjectProvider = () => ({ ...useContext(ProjectContext) });