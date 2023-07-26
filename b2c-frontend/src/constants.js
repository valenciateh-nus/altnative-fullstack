export const drawerWidth = 248;

export const REFASHIONEE_VIEW = 'REFASHIONEE_VIEW';
export const REFASHIONER_VIEW = 'REFASHIONER_VIEW';
export const MARKET_VIEW = 'MARKET_VIEW';
export const SWAP_VIEW = 'SWAP_VIEW';

export function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

export function generateChatId(userId1, userId2, projectId) {
    let chatId = '';

    if(userId1 < userId2) {
        chatId += userId1 + '_' + userId2;
    } else {
        chatId += userId2 + '_' + userId1;
    }

    if(projectId) {
        chatId+= '_' + projectId
    }

    return chatId;
}
