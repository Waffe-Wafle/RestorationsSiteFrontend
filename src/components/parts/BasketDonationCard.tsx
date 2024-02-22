import React, { FC } from "react";
import Button from 'react-bootstrap/Button';
import imgPlaceholder from '../../hooks_and_utils/imgPlaceholder';
import { RegroupedDonation } from "../../interfaces";

interface BasketCardProps {
    donation: RegroupedDonation;
    manageBasket: Function;
}

const BasketDonationCard: FC<BasketCardProps> = ({ donation, manageBasket }) => {
    return (
        <table className="table text-center">
            <thead>
            <tr>
                <th colSpan={5} className="border-left border-right">
                    <Button className="small btn btn-primary w-25" href={"#/restoration/" + donation.restore_id}>
                        {donation.restore_name}
                    </Button>
                </th>
            </tr>
            <tr>
                <th className="border-left border-right">Работа</th>
                <th className="border-right">Требуется, ₽</th>
                <th className="border-right">Пожертвовано, ₽</th>
                <th className="border-right">Доля, %</th>
                <th className="border-right">Действия</th>
            </tr>
            </thead>
            <tbody>
            {donation.worksDonations.map((workDonation, index) => (
                <tr key={index}>
                    <td className="border-left border-right">{workDonation.work}</td>
                    <td className="border-right">{workDonation.total_sum}</td>
                    <td className="border-right">{workDonation.given_sum}</td>
                    <td className="border-right">{workDonation.percent}</td>
                    <td className="border-right">
                        <div className="d-flex justify-content-center">
                            <Button className="mt-2 mr-2" onClick={() => manageBasket(workDonation, true)} variant="success">
                                Изменить
                            </Button>
                            <Button className="mt-2 ml-2" onClick={() => manageBasket(workDonation, false)} variant="danger">
                                Удалить
                            </Button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <td colSpan={5} className="border-top"></td>
            </tr>
            </tfoot>
        </table>
    );
};

export default BasketDonationCard;
