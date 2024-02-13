import React, {FC, useEffect, useState} from "react";
import {RestorationDonationType} from "../../interfaces";


interface RestorationDonationProps {
    donation: RestorationDonationType;
    index: number;
}


const RestorationDonation: FC<RestorationDonationProps> = ({ donation, index }) => (
    <React.Fragment key={index}>
        {donation.works.map((work, workIndex) => (
            <tr key={`${index}-${workIndex}`}>
                {workIndex === 0 && (
                    <td className="text-center" rowSpan={donation.works.length}>
                        {donation.name}
                    </td>
                )}
                <td>{work.work}</td>
                <td>{work.given_sum}</td>
                <td className="text-center">{work.percent}</td>
                {workIndex === 0 && (
                    <>
                        <td className="text-center" rowSpan={donation.works.length}>
                            {donation.given_sum}
                        </td>
                        <td className="text-center" rowSpan={donation.works.length}>
                            {donation.percent}
                        </td>
                    </>
                )}
            </tr>
        ))}
    </React.Fragment>
);


export default RestorationDonation;

