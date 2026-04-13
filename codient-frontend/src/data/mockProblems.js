export const mockProblems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    acceptanceRate: '49.2%',
    description: `
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example 1:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Constraints:
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- **Only one valid answer exists.**
    `,
    starterCode: {
      python: 'def twoSum(nums, target):\n    # Write your code here\n    pass'
    }
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    tags: ['Linked List', 'Math'],
    acceptanceRate: '39.8%',
    description: `You are given two non-empty linked lists representing two non-negative integers...`,
    starterCode: {
      python: 'def addTwoNumbers(l1, l2):\n    pass'
    }
  },
  {
    id: 3,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptanceRate: '35.1%',
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively...`,
    starterCode: {
      python: 'def findMedianSortedArrays(nums1, nums2):\n    pass'
    }
  }
];
