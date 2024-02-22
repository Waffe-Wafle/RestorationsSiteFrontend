import {DonationType, RegroupedDonation} from "../interfaces";


const summarizeDonations = (donations: DonationType[]): RegroupedDonation[] => {
    const summaryMap = {};
    if (donations && donations.length > 0) {
        donations.forEach(donation => {
            const {restore_id, restore_name, work_id, work, given_sum, total_sum, percent, restore_bank} = donation;

            if (!summaryMap[restore_id]) {
                summaryMap[restore_id] = {restore_id, restore_name, restore_bank, worksDonations: []};
            }
            summaryMap[restore_id].worksDonations.push({work_id, work, given_sum, total_sum, percent});
        });
    }

    return Object.values(summaryMap);
}


export default summarizeDonations;
