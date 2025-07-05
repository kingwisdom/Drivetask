import * as Notifications from 'expo-notifications';

export async function scheduleTaskNotification(taskId: string, title: string, dueDate: string) {
    const triggerTime: any = new Date(dueDate);
    triggerTime.setMinutes(triggerTime.getMinutes() - 10);

    // If the trigger time is in the past, don't schedule
    if (triggerTime <= new Date()) return;

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: `Upcoming Task: ${title}`,
            body: `Due in 10 minutes`,
            data: { taskId },
        },
        trigger: triggerTime
    });

    return identifier;
}
export async function scheduleNowTaskNotification(taskId: string, title: string, dueDate: string) {
    const triggerTime: any = new Date(dueDate);
    triggerTime.setMinutes(triggerTime.getMinutes());

    // If the trigger time is in the past, don't schedule
    if (triggerTime <= new Date()) return;

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title: `Upcoming Task: ${title}`,
            body: `Your task ${title} is Due`,
            data: { taskId },
        },
        trigger: triggerTime
    });

    return identifier;
}


export async function cancelNotification(identifier: string) {
    try {
        await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (e) {
        console.warn('Failed to cancel notification', e);
    }
}
