//package com.altnative.Alt.Native.Repository;
//
//import com.altnative.Alt.Native.Model.CreditCard;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//public interface CreditCardRepo extends JpaRepository<CreditCard, Long> {
//
//
//    @Query("SELECT c FROM CreditCard c JOIN FETCH c.transactions WHERE c.id = (:id)")
//    public CreditCard findByIdAndFetchTransEagerly(@Param("id") Long id);
//
//    public CreditCard findByCardNumber(String cardNumber);
//
//}