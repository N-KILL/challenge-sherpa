// Challenge type 
type Challenge = {
    vault: string[];
    targets: number[];
    hint: string;
    bookTitle: string;
  };
  
// Binary search function to find the target index in the array
function binarySearchIndex<T>(arr: T[], targetIndex: number): T | null {
    let left = 0;
    let right = arr.length - 1;
    let steps = 0;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        steps++;

        if (mid === targetIndex) {
        return arr[mid];
        } else if (mid < targetIndex) {
        left = mid + 1;
        } else {
        right = mid - 1;
        }
    }

    return null;
}

// Decode the password by mapping the target indices to the values in the vault using binary search
export function decodePassword(challenge: Challenge): string {
    return challenge.targets.map((index) => binarySearchIndex(challenge.vault, index)).join('');
}

