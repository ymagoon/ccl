<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema" 
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	exclude-result-prefixes="xs fn n cdocfx">
	
	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug -->  <xsl:import href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:import href="commonfxn.xslt" />-->  
	
	<!-- Get the priority of given diagnosis using clinical-priority attribute. Return 999 if clinical
		 priority is 0 or does not exist -->
	<!-- Parameters: -->
	<!--	dx - diagnosis object -->
	<xsl:function name="cdocfx:getDxPriority" as="xs:integer">
		<xsl:param name="dx"/>
		<xsl:choose>
			<xsl:when test="$dx/@clinical-priority">
				<xsl:choose>
					<xsl:when test="$dx/@clinical-priority = 0">
						<xsl:value-of select="999"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$dx/@clinical-priority"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="999"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Get display of the given diagnosis. Use diagnosis-name/freetext when available, otherwise attribute annotated-display -->
	<!-- Parameters: -->
	<!--	dx - diagnosis object -->
	<xsl:function name="cdocfx:getDxDisplay" as="xs:string">
		<xsl:param name="dx"/>
		<xsl:choose>
			<xsl:when test="$dx/n:diagnosis-name/n:freetext">
				<xsl:value-of select="$dx/n:diagnosis-name/n:freetext"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$dx/@annotated-display">
						<xsl:value-of select="$dx/@annotated-display"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="cdocfx:getNomenclatureDescByID($dx/n:diagnosis-name/n:nomenclature)"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- Get priority display of the given diagnosis. Return diagnosis priority followed by a period and
		 space, return empty string if priority is 0 or non-existing-->
	<!-- Parameters: -->
	<!--	dx - diagnosis object -->
	<xsl:function name="cdocfx:getDxPriorityDisplay" as="xs:string">
		<xsl:param name="dx"/>
		<xsl:choose>
			<xsl:when test="$dx/@clinical-priority">
				<xsl:choose>
					<xsl:when test="$dx/@clinical-priority = '0'">
						<xsl:value-of select="''"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:variable name="space">.<![CDATA[&#160;]]></xsl:variable>
						<xsl:value-of select="concat($dx/@clinical-priority, $space)" disable-output-escaping="yes"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="''"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- shouldDisplayDiagnosis function decides whether a diagnosis to be displayed or not -->
	<!-- Diagnosis if to be displayed it should satisfy either of the conditions -->
	<!-- Condition 1. It should have the narrative text -->
	<!-- Condition 2.  It should have the clinical priority value greater than  zero -->
	<!-- function description : this function decides whether a diagnosis should be displayed or not based on the above two conditions  -->
	<!-- Parameters -->
	<!-- diagnosis : - the diagnosis node -->
	<!-- entityIdList : - the entity id list of the diagnoses which has narrative text -->
	<!-- retuns : boolean true or false  -->
	<xsl:function name="cdocfx:shouldDisplayDiagnosis">
		<xsl:param name="diagnosis"/>
		<xsl:param name="entityIdList"/>
		
		<xsl:choose>
			<!-- check whether the list is populated or not -->
			<xsl:when test="count($entityIdList) &gt; 0">
				<xsl:choose>
				<!-- check the diagnosis id is not present in the entire entity id list --> 
					<xsl:when test="not($entityIdList = $diagnosis/@id)">
						<xsl:value-of select="cdocfx:priorityCheck($diagnosis)"/>
					</xsl:when>
					<!-- the diagnosis id is present in the entity id list -->
					<xsl:otherwise>
						<xsl:value-of select="true()"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<!-- if the entity id list is empty then only check for the priority of the diagnosis -->
				<xsl:value-of select="cdocfx:priorityCheck($diagnosis)"/>
			</xsl:otherwise>
		</xsl:choose>
		
		
	</xsl:function>
	
	<!-- createEntityidList function creates an entity id list which has the narrative text -->
	<!-- Parameters -->
	<!-- formatInputsNodes the format input node -->
	<!-- function description : creates an entity id element list which has the narrative text -->
	<!-- returns : element entityIdList entity id list -->
	<xsl:function name="cdocfx:createEntityidList" as="element()*">
		<xsl:param name="formatInputsNodes"/>
		
		<xsl:variable name="entityIdList" as="element()*">
			<xsl:choose>
				<xsl:when test="fn:exists($formatInputsNodes/n:narrative-entity-ids)">
					<xsl:for-each select="$formatInputsNodes/n:narrative-entity-ids/n:entity">
						<xsl:if test="@id &gt; 0 and @type-cdf-meaning = 'DIAGNOSES'">
							<entity><xsl:value-of select="@id"/></entity>
						</xsl:if>
					</xsl:for-each>	
				</xsl:when>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:copy-of select="$entityIdList"/>
		
	</xsl:function>
	
	<!-- priorityCheck function to check the clinical priority value -->
	<!-- Parameters -->
	<!-- diagnosis: element the diagnosis node -->
	<!-- function description return true if the clinical priority value gretaer than zero else false -->
	<!-- returns: boolean true or false -->
	<xsl:function name="cdocfx:priorityCheck" as="xs:boolean">
		<xsl:param name="diagnosis"/>
		
		<xsl:choose>
			<!-- check for the value of clinical priority greater than zero  -->
			<xsl:when test="$diagnosis/@clinical-priority &gt; 0">
				<xsl:value-of select="true()"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- if the value of clinical priority is less than zero return false -->
				<xsl:value-of select="false()"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:function>
	
	<!-- getDisplayableDiagnoses function creates a list of diagnosis elements which are to be displayed -->
	<!-- Parameters -->
	<!-- clinicalDiagnosis: node all the clinical-diagnosis -->
	<!--  entityIdList elements list of entity id which has the narrative text -->
	<!-- function description :  a list of diagnosis elements which is to be displayed.These diagnosis either have priority or narrative text -->
	<!-- returns : diagnosis element list -->
	<xsl:function name="cdocfx:getDisplayableDiagnoses">
		<xsl:param name="clinicalDiagnosis"/>
		<xsl:param name="entityIdList"/>
		
		<!-- dxList is the list of diagnosis which are qualified to be displayed  -->
		<xsl:variable name="dxList" as="element()*">
			<xsl:choose>
				<!-- Code changes made as a part of DYNAMICDOC-743 to support backward compatibility. -->
				<!-- If the clinical-priority attribute is set to zero for all the diagnosis nodes (i.e. all of them are unprioritized), then display all of them. -->
				<xsl:when test="count($clinicalDiagnosis[@clinical-priority = 0 and @is-active='true']) = count($clinicalDiagnosis[@is-active='true'])">
					<xsl:perform-sort select="$clinicalDiagnosis[@is-active='true']">
						<xsl:sort select="fn:upper-case(cdocfx:getDxDisplay(.))" order="ascending"/>        
					</xsl:perform-sort>
				</xsl:when>
				<xsl:otherwise>
					<!-- if any one of the diagnosis is prioritized, then display only  prioritized diagnosis -->
					<xsl:perform-sort select="$clinicalDiagnosis[@is-active='true' and cdocfx:shouldDisplayDiagnosis(.,$entityIdList)=true()]">
						<xsl:sort select="cdocfx:getDxPriority(.)" order="ascending"/>
						<xsl:sort select="fn:upper-case(cdocfx:getDxDisplay(.))" order="ascending"/>        
					</xsl:perform-sort>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:copy-of select="$dxList"/>
	</xsl:function>
	
	<!-- getDiagnosesForMatchingNomenID function which creates a element list of diagnoses which match with the nomenID -->
	<!-- Parameters -->
	<!-- nomenId : String nomenclature Id -->
	<!-- dxList :  Elements contains all the diagnoses which is to be displayed-->
	<!-- function description : for the the given nomenId corresponding matching diagnoses are  created   -->
	<!-- returns : a newly created element list  -->
	<xsl:function name="cdocfx:getDiagnosesForMatchingNomenID">
		<xsl:param name="nomenId"/>
		<xsl:param name="dxList"/>
		
		<!-- matchingDiagnosis contains all the diagnosis which are matching the nomenId -->
		<xsl:variable name="matchingDiagnoses" as="element()*">
			<xsl:for-each select="$dxList">
				<xsl:if test="$nomenId = ./n:diagnosis-name/n:nomenclature">
					<xsl:copy-of select="."/>
				</xsl:if>
			</xsl:for-each>
		</xsl:variable>
		
		<xsl:copy-of select="$matchingDiagnoses"/>
	</xsl:function>
	
</xsl:stylesheet>