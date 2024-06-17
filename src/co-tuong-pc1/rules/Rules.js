import './Rules.less';

export let Rules = () => {
    return (
        <div class="Rules">
            <details>
                <summary>Xem chi tiết</summary>
                <h3>Cách thức tiến hành:</h3>
                <ul>
                    <li>Thể thức vòng tròn tính điểm 11 vòng đấu, diễn ra trong 11 tuần. Mỗi kỳ thủ thi đấu 1 trận mỗi vòng.</li>
                    <li>Trận chung kết diễn ra giữa 2 kỳ thủ đứng đầu.</li>
                    <li>Mỗi trận đấu các kỳ thủ thi đấu 2 ván cờ để quyết định thắng/hòa/thua. Kỳ thủ thắng trận đấu được 2 điểm, hòa 1 điểm, thua 0 điểm.</li>
                    <li>Thể thức ván cờ: 25 phút tích lũy 10 giây cho mỗi nước đi (25m+10s).</li>
                </ul>
                <h3>Luật cờ tướng Việt Nam:</h3>
                <p>Giải đấu áp dụng <a href="/files/luat_co_tuong.pdf">Luật cờ tướng Việt Nam</a>. Một số ý chính:</p>
                <ul>
                    <li>Cách xếp hạng các kỳ thủ: Trang 16, mục 21.3</li>
                    <li>Mười điểm chính khi xử ván cờ: Trang 17, mục 23</li>
                </ul>
            </details>
        </div>
    );
};
