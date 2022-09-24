import { SearchOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { useState, DragEvent } from "react";
import { SquareType } from "./helpers";

interface MenuProps {
  active: boolean;
  handleDrag: (squareType: SquareType) => void;
  handleDragEnd: () => void;
  handleAddItem: (squareType: SquareType) => void;
}
  
export function Menu(props: MenuProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  }

  const getMenuItems = (searchTerm: string) => {
    let newMenuItems = [];
    for (let squareType of SquareType.getAllAppliances()) {
      if (searchTerm === "" || squareType.getImageAlt().toLowerCase().includes(searchTerm.toLowerCase())) {
        if (props.active) {
          newMenuItems.push(
            <Tooltip title={
              <>
                {squareType.getImageAlt()}
              </>}
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    key={squareType.getImageAlt()}>
              <div className="menu-item" 
                onClick={() => {props.handleAddItem(squareType);}}
                style={{
                  order: squareType.getOrder(),
                  cursor: "pointer",
                  position: "relative"
                }}>
                <img className="menu-image"
                  draggable={true}
                  onDrag={(event: DragEvent) => { 
                    event.preventDefault();
                    props.handleDrag(squareType);
                  }}
                  onDragEnd={(event: DragEvent) => {
                    event.preventDefault();
                    props.handleDragEnd();
                  }}
                  src={squareType.getImageMenuPath()} 
                  alt={squareType.getImageAlt()}/>
              </div>
            </Tooltip>
          );
        } else {
          newMenuItems.push(
            <div className="menu-item" 
                 style={{
                   order: squareType.getOrder(),
                   cursor: "not-allowed",
                   position: "relative"
                 }}
            >
              <img
                style={{ filter: "grayscale(100%) contrast(40%) brightness(130%)" }}
                className="menu-image"
                src={squareType.getImageMenuPath()} 
                alt={squareType.getImageAlt()}/>
            </div>
          );
        }
      }
    }
    return newMenuItems;
  }

  return (
    <div className="menu">
      <Input size="large" placeholder="Search for items to add" 
             prefix={<SearchOutlined/>}
             disabled={!props.active}
             onChange={(e) => handleSearch(e.target.value)}
             allowClear={true}
             style={{
               width: "100%"
             }}/>
        <div className="menu-items"
            style={{
              margin: "1em"
            }}>
          {getMenuItems(searchTerm)}
        </div>
      </div>
  );
}