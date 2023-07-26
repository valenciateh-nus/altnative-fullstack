import { Avatar, Badge, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material"
import { Box } from "@mui/system"
import moment from "moment"
import React from "react"
import { toTitleCase } from "../../constants"


export default function ContactCard({chat,user,handleClick}) {
    return(
        <ListItemButton onClick={()=>handleClick(chat,user)}>
            <ListItemAvatar>
                <Avatar src={user.avatar?.url } alt={user.name}/>
            </ListItemAvatar>
            <Box sx = {{display : "flex", flexDirection : "row", justifyContent : "space-between", width : "100%", minWidth : 0}}>
            <ListItemText 
                primary = {toTitleCase(user.name)} 
                secondary = {chat.lastMessage ? (chat.lastMessage.offer === false ? chat.lastMessage.message : user.name + " has sent an offer.") : ''} 
                primaryTypographyProps={{ 
                    style: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight : 700,
                    }
                }}
                secondaryTypographyProps={{ 
                    variant: 'subtitle2', 
                    style: {
                        color : '#A0A3B1',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }
                }}
            />
            {chat.lastMessage && <Typography variant = 'subtitle2' sx ={{paddingTop : '7px'}}>
                {moment(chat.lastMessage.dateCreated).isSame(moment(new Date()).subtract(1,'days'), 'day') 
                ? "Yesterday" 
                : (moment(chat.lastMessage.dateCreated).isSame(new Date(), 'day') 
                ? moment(chat.lastMessage.dateCreated).format("hh:mm")
                : (moment(chat.lastMessage.dateCreated).isSame(new Date(), 'week') 
                    ? moment(chat.lastMessage.dateCreated).format("ddd") 
                    : moment(chat.lastMessage.dateCreated).format("DD/MM/YY")
                    ))
                }
            </Typography>
            }
            </Box>
            <Badge color="secondary" badgeContent={chat.user1.username !== user.username ? chat.user1UnreadCount : chat.user2UnreadCount} max={99} sx={{marginTop: 3.5, marginRight: 2 }}/> 
        </ListItemButton>
    )
}